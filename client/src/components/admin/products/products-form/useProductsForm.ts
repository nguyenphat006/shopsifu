import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProductCreateRequest,
  Variant,
  Sku,
  ProductDetail,
  ProductUpdateRequest,
  SkuDetail,
} from '@/types/products.interface';
import { BaseEntity } from '@/types/base.interface';
import { productsService } from '@/services/productsService';
import { showToast } from '@/components/ui/toastify';
import { spec } from 'node:test/reporters';

// Định nghĩa kiểu dữ liệu cho SKU trong form state
// Nó có thể là SkuDetail (từ API, có id) hoặc Sku (khi mới tạo, chưa có id)
type FormSku = Partial<SkuDetail>;

// Định nghĩa kiểu dữ liệu cho state của form
export type FormState = Omit<ProductCreateRequest, 'skus' | 'categories' | 'brandId' | 'publishedAt' | 'images'> & {
  skus: FormSku[];
  categories: string[]; // Lưu dưới dạng string trong state, nhưng sẽ convert về number khi submit
  brandId: string | null; // Cho phép brandId là null, sử dụng string vì API trả về UUID
  description: string;
  publishedAt: string | null; // Thêm trường publishedAt
  images: string[]; // Giữ mảng URLs đơn giản cho state nội bộ
};

const INITIAL_STATE: FormState = {
  name: '',
  description: '',
  basePrice: 0,
  virtualPrice: 0,
  brandId: null, // Sử dụng string | null
  images: [], // Mảng URLs dạng string
  categories: [],
  specifications: [
    {
      name: '',
      value: '',
    }
  ],
  variants: [],
  skus: [],
  publishedAt: null, // Mặc định là null (chưa công khai)
};

interface UseProductsFormProps {
  initialData?: ProductDetail | null;
  onCreateSuccess?: (newProductId: string) => void; // Callback để chuyển hướng sau khi tạo thành công
}

export const useProductsForm = ({ initialData, onCreateSuccess }: UseProductsFormProps) => {
  const [productData, setProductData] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isEditMode = !!initialData;

  // Hàm reset form về trạng thái ban đầu
  const resetForm = () => {
    setProductData(INITIAL_STATE);
    // Có thể thêm logic reset cho các trường khác nếu cần
  };

  useEffect(() => {
    if (initialData) {
      console.log('useProductsForm - Initializing with data:', initialData);

      // Xử lý images từ API, chuyển từ mảng objects { url: string } sang mảng string URLs
      const processedImages = initialData.images?.map((img: any) => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object' && 'url' in img) return img.url;
        return '';
      }).filter(Boolean) || [];

      // Xử lý categories, đảm bảo chuyển thành string để dễ xử lý trong form
      const processedCategories = initialData.categories?.map(c => {
        // Lấy ID từ category và đảm bảo là string
        return c.id ? String(c.id) : '';
      }).filter(Boolean) || [];

      const mappedData = {
        id: initialData.id,
        name: initialData.name || '',
        description: initialData.description || '',
        basePrice: initialData.basePrice || 0,
        virtualPrice: initialData.virtualPrice || 0,
        brandId: initialData.brand?.id?.toString() || null, // Lấy id từ object brand lồng nhau và chuyển sang string
        images: processedImages, // Lưu mảng URLs dạng string để dễ xử lý trong state
        categories: processedCategories, // Map từ object CategoryDetail sang mảng ID string
        specifications: initialData.specifications || [],
        variants: initialData.variants || [],
        skus: initialData.skus || [], // Gán trực tiếp mảng SkuDetail
        publishedAt: initialData.publishedAt, // Lấy trường publishedAt từ dữ liệu ban đầu
      };

      console.log('useProductsForm - Processed data:', mappedData);
      setProductData(mappedData);
    }
  }, [initialData]);

  const handleInputChange = useCallback((field: keyof FormState, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  }, []);

  const setVariants = useCallback((newVariants: Variant[]) => {
    console.log('setVariants called with:', newVariants);

    // Kiểm tra xem có variant nào có options không
    const variantsWithOptions = newVariants.filter(v => v.options && v.options.length > 0);
    console.log('Variants with options:', variantsWithOptions);

    // Nếu không có variants có options, đặt variants và xóa SKUs
    if (variantsWithOptions.length === 0) {
      console.log('No variants with options, clearing SKUs');
      setProductData(prev => ({ ...prev, variants: newVariants, skus: [] }));
      return;
    }

    // Tạo các kết hợp có thể từ variants
    const combinations = variantsWithOptions.reduce<string[]>((acc, variant) => {
      if (acc.length === 0) {
        return variant.options.map(opt => opt);
      }
      return acc.flatMap(combination => variant.options.map(opt => `${combination}-${opt}`));
    }, []);

    console.log('Generated combinations:', combinations);

    // Giữ lại các SKUs hiện tại dựa trên ID
    const currentSkus = productData.skus || [];
    console.log('Current SKUs:', currentSkus);

    // Tạo SKUs mới từ combinations
    const newSkus: Omit<Sku, 'id'>[] = combinations.map(combo => {
      // Tìm SKU hiện tại có cùng value
      const existingSku = currentSkus.find(sku => sku.value === combo);

      // Nếu tìm thấy SKU cũ, giữ lại các giá trị
      if (existingSku) {
        console.log(`Found existing SKU for combination ${combo}:`, existingSku);
        return {
          value: combo,
          price: existingSku.price || productData.basePrice,
          stock: existingSku.stock || 0,
          image: existingSku.image || '',
          id: existingSku.id, // Giữ lại ID của SKU hiện tại
        };
      }

      // Nếu không, tạo mới
      return {
        value: combo,
        price: productData.basePrice,
        stock: 0,
        image: '',
      };
    });

    console.log('New SKUs to set:', newSkus);

    // Cập nhật state
    setProductData(prev => ({ ...prev, variants: newVariants, skus: newSkus }));
  }, [productData.basePrice, productData.skus]);

  const updateSingleSku = useCallback((index: number, updatedSku: Partial<FormSku>) => {
    console.log(`updateSingleSku - Updating SKU at index ${index}:`, updatedSku);

    setProductData(prev => {
      // Đảm bảo mảng skus đủ lớn
      const newSkus = [...prev.skus];

      // Kiểm tra xem index có hợp lệ không
      if (index < 0 || index >= newSkus.length) {
        console.error(`updateSingleSku - Invalid index: ${index}, skus length: ${newSkus.length}`);
        return prev; // Không thực hiện cập nhật nếu index không hợp lệ
      }

      // Ghi log SKU hiện tại và SKU sau khi cập nhật
      console.log('updateSingleSku - Current SKU:', newSkus[index]);
      const updatedSkuObject = { ...newSkus[index], ...updatedSku };
      console.log('updateSingleSku - After update:', updatedSkuObject);

      // Cập nhật SKU
      newSkus[index] = updatedSkuObject;

      return { ...prev, skus: newSkus };
    });
  }, []);

  const handleSubmit = async (options: { stayOnPage?: boolean } = {}) => {
    setIsSubmitting(true);

    // Chuẩn bị dữ liệu gửi lên API theo đúng thứ tự
    // Xử lý SKUs để loại bỏ các trường không cần thiết (id, createdAt, updatedAt)
    const processedSkus = productData.skus.map(({ id, createdAt, updatedAt, ...skuRest }) => ({
      value: skuRest.value || '',
      price: skuRest.price || 0,
      stock: skuRest.stock || 0,
      image: skuRest.image || '',
    }));

    // Truyền thẳng mảng string URLs cho images theo yêu cầu API
    const filteredImages = productData.images.filter(url => url && url.trim() !== '');
    console.log('Product images từ form state:', productData.images);
    console.log('Images đã lọc (bỏ rỗng):', filteredImages);

    // Lọc bỏ các giá trị không hợp lệ trong mảng categories
    // Giữ nguyên dạng string UUID theo yêu cầu API
    const validCategories = productData.categories
      .filter(id => id && id !== 'null' && id !== 'undefined' && String(id).trim() !== '');
    
    console.log('Categories trước khi lọc:', productData.categories);
    console.log('Categories sau khi lọc (giữ nguyên định dạng UUID):', validCategories);
    console.log('Chi tiết IDs: ', productData.categories.map(id => ({
      original: id,
      numeric: String(id).match(/\d+/)?.[0] || 'no match',
      converted: parseInt(String(id).match(/\d+/)?.[0] || id, 10)
    })));

    // Xử lý và lọc specifications
    const filteredSpecifications = (productData.specifications || [])
      .filter(spec => spec.name.trim() !== '' && spec.value.trim() !== '')
      .map(spec => ({
        name: spec.name.trim(),
        value: spec.value.trim()
      }));
    
    console.log('Specifications before filtering:', productData.specifications);
    console.log('Specifications after filtering:', filteredSpecifications);

    const submissionData = {
      name: productData.name,
      description: productData.description, // Thêm trường description vào dữ liệu gửi đi
      publishedAt: productData.publishedAt,
      basePrice: productData.basePrice,
      virtualPrice: productData.virtualPrice,
      brandId: productData.brandId || '', // Dùng string rỗng nếu null
      images: filteredImages.length > 0 ? filteredImages : [], // Truyền mảng string URLs trực tiếp
      categories: validCategories, // Sử dụng mảng đã được lọc, giữ nguyên là string UUID
      variants: productData.variants,
      skus: processedSkus,
      specifications: filteredSpecifications,
    };

    console.log('Submitting product data:', submissionData);

    // Kiểm tra các điều kiện hợp lệ trước khi gửi
    if (!submissionData.brandId) {
      showToast('Vui lòng chọn thương hiệu.', 'error');
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra bắt buộc phải có tên sản phẩm
    if (!submissionData.name || submissionData.name.trim() === '') {
      showToast('Vui lòng nhập tên sản phẩm.', 'error');
      setIsSubmitting(false);
      return;
    }
    
    // Kiểm tra các thông số kỹ thuật bắt buộc
    const requiredSpecNames = ['Xuất xứ', 'Chất liệu', 'Kho hàng', 'Vị trí kho', 'Gửi từ'];
    const existingSpecNames = submissionData.specifications.map(spec => spec.name);
    
    const missingSpecs = requiredSpecNames.filter(reqName => 
      !existingSpecNames.includes(reqName) || 
      !submissionData.specifications.find(s => s.name === reqName && s.value.trim() !== '')
    );
    
    if (missingSpecs.length > 0) {
      showToast(`Vui lòng điền đầy đủ thông tin cho các trường thông số bắt buộc: ${missingSpecs.join(', ')}`, 'error');
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra SKUs nếu có variants
    if (submissionData.variants && submissionData.variants.length > 0) {
      // Kiểm tra xem có SKUs không
      if (!submissionData.skus || submissionData.skus.length === 0) {
        showToast('Bạn đã thêm biến thể nhưng không có SKU nào được tạo.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Kiểm tra xem tất cả SKUs có giá không
      const skusWithoutPrice = submissionData.skus.filter(sku => !sku.price || sku.price <= 0);
      if (skusWithoutPrice.length > 0) {
        showToast(`Có ${skusWithoutPrice.length} SKU chưa có giá. Vui lòng cập nhật giá cho tất cả SKU.`, 'error');
        setIsSubmitting(false);
        return;
      }

      // Log chi tiết của submission để debug
      console.log('Submitting product with variants:', submissionData.variants.length);
      console.log('SKUs being submitted:', submissionData.skus.length);
    }

    // Log description để xác nhận nó đã được đưa vào dữ liệu gửi đi
    console.log('Description being submitted:', submissionData.description);

    try {
      // Double-check đảm bảo images luôn là mảng (không phải null/undefined)
      if (!submissionData.images) submissionData.images = [];

      // Log dữ liệu request trước khi gửi đi
      console.log('Final request data (images):', submissionData.images);

      if (initialData) {
        // Gửi yêu cầu cập nhật không bao gồm description
        await productsService.update(String(initialData.id), submissionData as unknown as ProductUpdateRequest);
        console.log('Product updated successfully');
        showToast('Sản phẩm đã được cập nhật.', 'success');
      } else {
        // Gửi yêu cầu tạo mới không bao gồm description
        const response = await productsService.create(submissionData);
        showToast("Tạo sản phẩm thành công!", "success");
        // Nếu là 'Lưu và thêm mới', reset form, ngược lại thì chuyển trang
        if (options.stayOnPage) {
          resetForm();
        } else {
          router.push('/admin/products');
        }
      }
    } catch (error: any) {
      console.error('Failed to submit product:', error);
      // Hiển thị thông báo lỗi chi tiết hơn nếu có
      const errorMessage = error?.response?.data?.message || error?.message || 'Đã có lỗi xảy ra khi lưu sản phẩm';
      showToast(errorMessage, 'error');

      // Log chi tiết lỗi để debug
      console.log('Request data was:', submissionData);
      console.log('Error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndAddNew = async () => {
    await handleSubmit({ stayOnPage: true });
  };

  return {
    productData,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
    handleSaveAndAddNew,
    isEditMode,
  };
};