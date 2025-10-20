import { ReactNode } from 'react';

/**
 * Interface cho một Variant từ API
 */
export interface VariantGroup {
  value: string;
  options: string[];
}

/**
 * Interface cho một SKU từ API
 */
export interface Sku {
  id: string;
  value: string;
  price: number;
  stock: number;
  image: string;
  productId: string;
}

/**
 * Interface cho các lựa chọn variant của người dùng
 */
export type SelectedVariants = Record<string, string | null>;

/**
 * Tạo chuỗi value theo định dạng SKU từ các lựa chọn variant
 * Ví dụ: Từ { "Color": "Short Đen LA", "Size": "L" } -> "Short Đen LA-L"
 */
export function createSkuValueFromSelectedVariants(
  selectedVariants: SelectedVariants,
  variantGroups: VariantGroup[]
): string | null {
  // Kiểm tra xem đã chọn đủ tất cả variant chưa
  const allVariantsSelected = Object.values(selectedVariants).every(val => val !== null);
  
  if (!allVariantsSelected) {
    return null;
  }

  // Sắp xếp các variants theo thứ tự chuẩn để tạo value đúng cú pháp
  // Thường thì màu sẽ đứng trước, sau đó đến kích thước
  
  // Ưu tiên xử lý theo các trường hợp cụ thể trước
  const colorVariant = selectedVariants["Color"] || selectedVariants["Màu sắc"] || selectedVariants["Màu"];
  const sizeVariant = selectedVariants["Size"] || selectedVariants["Kích thước"] || selectedVariants["Kích cỡ"];
  
  if (colorVariant && sizeVariant) {
    return `${colorVariant}-${sizeVariant}`;
  } 
  
  // Nếu không có cả màu và kích thước, ghép tất cả các giá trị đã chọn lại theo thứ tự
  // xác định bởi variantGroups
  const selectedValues: string[] = [];
  
  variantGroups.forEach(group => {
    const value = selectedVariants[group.value];
    if (value) {
      selectedValues.push(value);
    }
  });
  
  return selectedValues.join('-');
}

/**
 * Tìm SKU dựa trên các lựa chọn variant
 */
export function findMatchingSku(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): Sku | null {
  const skuValue = createSkuValueFromSelectedVariants(selectedVariants, variantGroups);
  
  if (!skuValue) {
    return null;
  }
  
  // Normalize the sku.value from the API by removing spaces around the hyphen for a reliable comparison.
  return skus.find(sku => sku.value.replace(/\s*-\s*/g, '-') === skuValue) || null;
}

/**
 * Kiểm tra xem một option có sẵn không dựa trên các lựa chọn hiện tại
 * và các SKU hiện có
 */
export function isOptionAvailable(
  variantType: string,
  option: string,
  selectedVariants: SelectedVariants,
  skus: Sku[]
): boolean {
  // Tạo một bản sao của selectedVariants với giả định rằng chọn option này
  const testVariants = { 
    ...selectedVariants, 
    [variantType]: option 
  };
  
  // Xóa các lựa chọn variant khác cùng loại để đơn giản hóa tìm kiếm
  const remainingVariants = Object.entries(testVariants)
    .filter(([key]) => key === variantType || testVariants[key] !== null)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as SelectedVariants);
  
  // Kiểm tra xem có SKU nào tồn tại với các lựa chọn này không
  return skus.some(sku => {
    // Với mỗi SKU, kiểm tra xem tất cả các variant đã chọn có trong value của SKU không
    return Object.values(remainingVariants).every(variant => 
      variant !== null && sku.value.includes(variant)
    );
  });
}

/**
 * Tính tổng stock cho tất cả SKU
 */
export function getTotalStock(skus: Sku[]): number {
  return skus.reduce((sum, sku) => sum + sku.stock, 0);
}

/**
 * Lấy stock hiện tại dựa trên SKU đã chọn hoặc tổng stock
 */
export function getCurrentStock(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[]
): number {
  const currentSku = findMatchingSku(selectedVariants, skus, variantGroups);
  return currentSku ? currentSku.stock : getTotalStock(skus);
}

/**
 * Tạo thông báo về stock
 */
export function getStockMessage(stock: number): ReactNode {
  if (stock <= 0) {
    return <span className="text-red-500">Hết hàng</span>;
  }
  
  if (stock <= 5) {
    return <span className="text-orange-500">Sắp hết hàng (còn {stock})</span>;
  }
  
  return <span>Còn {stock}</span>;
}

/**
 * Kiểm tra xem tất cả các variants đã được chọn chưa
 */
export function areAllVariantsSelected(selectedVariants: SelectedVariants): boolean {
  return Object.keys(selectedVariants).length > 0 && 
    Object.values(selectedVariants).every(val => val !== null);
}

/**
 * Tìm giá của SKU tương ứng với các variant đã chọn
 */
export function findSelectedSkuPrice(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  defaultPrice: number
): number {
  const sku = findMatchingSku(selectedVariants, skus, variantGroups);
  return sku ? sku.price : defaultPrice;
}

/**
 * Hàm xử lý thêm sản phẩm vào giỏ hàng
 * @param selectedVariants Các variant đã được người dùng chọn
 * @param skus Danh sách SKU của sản phẩm
 * @param variantGroups Danh sách nhóm variant của sản phẩm
 * @param quantity Số lượng sản phẩm cần thêm vào giỏ hàng
 * @param addToCartFn Hàm addToCart từ useCart hook
 * @returns Promise với cart item ID hoặc false nếu thất bại
 */
export async function handleAddToCart(
  selectedVariants: SelectedVariants,
  skus: Sku[],
  variantGroups: VariantGroup[],
  quantity: number,
  addToCartFn: (data: {skuId: string, quantity: number}, showNotification?: boolean) => Promise<string | boolean>
): Promise<string | false> {
  // Tìm SKU phù hợp với các lựa chọn variant
  const selectedSku = findMatchingSku(selectedVariants, skus, variantGroups);
  
  // Nếu không tìm thấy SKU phù hợp, trả về false
  if (!selectedSku) {
    console.error("Không tìm thấy SKU phù hợp với các lựa chọn");
    return false;
  }
  
  // Kiểm tra tồn kho
  if (selectedSku.stock <= 0) {
    console.error("Sản phẩm đã hết hàng");
    return false;
  }
  
  // Đảm bảo số lượng không vượt quá tồn kho
  const safeQuantity = Math.min(quantity, selectedSku.stock);
  
  // Gọi hàm addToCart từ hook useCart
  try {
    const result = await addToCartFn({
      skuId: selectedSku.id,
      quantity: safeQuantity
    }, true); // true để hiển thị thông báo
    
    // Return cart item ID if available, otherwise false
    return typeof result === 'string' ? result : false;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    return false;
  }
}
