import { useState, useEffect, useMemo, useRef } from 'react';
import { generateSKUs, Sku } from '@/utils/variantUtils';
import type { OptionData } from './form-VariantInput';

interface GroupedSkus {
  [key: string]: Sku[];
}

// Helpers
export const formatPrice = (value: number) => {
  if (value === 0) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parsePrice = (value: string) => {
  const numericString = value.replace(/[^0-9]/g, '');
  return numericString === '' ? 0 : parseInt(numericString, 10);
};

// Import SkuDetail từ products interface
import { SkuDetail } from '@/types/products.interface';

// Sử dụng Partial<SkuDetail> để phù hợp với FormSku trong useProductsForm
type FormSku = Partial<SkuDetail>;

// Hook Props
interface UseSkuProps {
  options: OptionData[];
  initialSkus?: FormSku[]; // Cập nhật kiểu dữ liệu để phù hợp
  onUpdateSkus: (skus: Sku[]) => void;
}

// Helper function to map API SKUs to component SKUs
function mapApiSkusToComponentSkus(apiSkus: FormSku[], options: OptionData[]): Sku[] {
  console.log('mapApiSkusToComponentSkus called with:');
  console.log('API SKUs:', apiSkus);
  console.log('Options:', options);
  
  if (!apiSkus?.length) {
    console.log('No API SKUs provided');
    return [];
  }
  
  if (!options?.length) {
    console.log('No options provided');
    return [];
  }
  
  // Kiểm tra dữ liệu API
  if (apiSkus.some(sku => !sku.value)) {
    console.warn('Some API SKUs are missing value property:', 
      apiSkus.filter(sku => !sku.value).map(sku => sku.id));
  }
  
  return apiSkus.map(apiSku => {
    try {
      // Đảm bảo apiSku.value là string
      const skuValue = apiSku.value || '';
      
      // Split value: "Đen-L" -> ["Đen", "L"]
      const valueParts = skuValue.split('-');
      console.log(`Processing SKU ${apiSku.id}, value: ${skuValue}, parts:`, valueParts);
      
      // Tạo variantValues từ valueParts và options
      const variantValues = options.map((option, index) => {
        // Đảm bảo rằng chúng ta có một giá trị cho mỗi option, ngay cả khi valueParts thiếu
        return {
          optionName: option.name,
          value: index < valueParts.length ? valueParts[index] : ''
        };
      });
      
      // Tạo name từ các valueParts để hiển thị thân thiện hơn
      const name = valueParts.join(' / ');
      
      // Tạo một SKU mới với dữ liệu từ API
      const mappedSku = {
        id: apiSku.id ? String(apiSku.id) : `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, 
        name: name, // Thêm name theo yêu cầu của interface Sku
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues
      };
      
      console.log('Mapped SKU:', mappedSku);
      
      return mappedSku;
    } catch (error) {
      console.error(`Error processing SKU ${apiSku.id}:`, error);
      
      // Trả về một SKU mặc định trong trường hợp lỗi
      return {
        id: apiSku.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: apiSku.value || 'Unknown',
        price: typeof apiSku.price === 'number' ? apiSku.price : 0,
        stock: typeof apiSku.stock === 'number' ? apiSku.stock : 0,
        image: apiSku.image || '',
        variantValues: options.map(option => ({
          optionName: option.name,
          value: ''
        }))
      };
    }
  });
}

export function useSku({ options, initialSkus, onUpdateSkus }: UseSkuProps) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Tham chiếu để theo dõi xem update đến từ bên trong hay bên ngoài
  const isInternalUpdate = useRef(false);
  
  // Thêm ref để theo dõi trạng thái khởi tạo
  const isInitialized = useRef(false);
  
  useEffect(() => {
    console.log('useSku effect triggered:', { 
      optionsLength: options.length, 
      initialSkusLength: initialSkus?.length, 
      isInternalUpdate: isInternalUpdate.current,
      isInitialized: isInitialized.current
    });
    
    // Nếu đã khởi tạo và là update từ bên trong, bỏ qua
    if (isInitialized.current && isInternalUpdate.current) {
      console.log('Skipping effect due to internal update');
      isInternalUpdate.current = false;
      return;
    }
    
    // Kiểm tra điều kiện để quyết định nguồn dữ liệu SKU
    const hasOptions = options && options.length > 0 && options.some(opt => opt.values && opt.values.length > 0);
    const hasInitialSkus = initialSkus && initialSkus.length > 0;
    
    // Log trạng thái
    console.log('SKU data source conditions:', { hasOptions, hasInitialSkus });
    
    let newSkus: Sku[] = [];
    
    try {
      if (hasInitialSkus && hasOptions) {
        // Có cả SKUs từ API và options -> dùng initialSkus
        console.log('Using initialSkus from API', initialSkus);
        newSkus = mapApiSkusToComponentSkus(initialSkus, options);
      } else if (hasOptions) {
        // Chỉ có options -> tạo mới SKUs từ options
        console.log('Generating new SKUs from options', options);
        newSkus = generateSKUs(options);
      } else {
        console.log('Not enough data to create SKUs');
        // Không có đủ dữ liệu để tạo SKUs
        newSkus = [];
      }
      
      console.log('Generated new SKUs:', newSkus);
      
      // Bảo toàn giá trị price, stock, image của SKUs hiện tại một cách thông minh hơn
      const preservedSkus = newSkus.map(newSku => {
        // Tìm SKU cũ theo nhiều tiêu chí khác nhau
        let oldSku = null;
        
        // 1. Tìm theo ID (cho SKUs đã có từ API)
        oldSku = skus.find(s => s.id === newSku.id);
        
        // 2. Nếu không tìm thấy bằng ID, thử tìm bằng name
        if (!oldSku) {
          oldSku = skus.find(s => s.name === newSku.name);
        }
        
        // 3. Nếu vẫn không tìm thấy, thử tìm bằng pattern của variantValues
        if (!oldSku) {
          // Tạo mảng các giá trị variant để so sánh
          const newValues = newSku.variantValues.map(v => v.value);
          
          oldSku = skus.find(s => {
            if (!s.variantValues || !Array.isArray(s.variantValues)) return false;
            
            // Kiểm tra xem có bao nhiêu giá trị giống nhau
            const oldValues = s.variantValues.map(v => v.value);
            const matchCount = newValues.filter(val => oldValues.includes(val)).length;
            
            // Nếu có ít nhất 1 giá trị trùng khớp và số lượng variantValues bằng nhau
            return matchCount > 0 && oldValues.length === newValues.length;
          });
        }
        
        if (oldSku) {
          return { 
            ...newSku, 
            price: oldSku.price || newSku.price,
            stock: oldSku.stock || newSku.stock,
            image: oldSku.image || newSku.image
          };
        }
        
        // Sử dụng basePrice từ product làm giá mặc định nếu có thể
        return newSku;
      });
      
      console.log('Setting skus state with preservedSkus:', preservedSkus.length);
      
      // Cập nhật state
      setSkus(preservedSkus);
      
      // Reset expanded state only if the primary option changes
      const oldFirstOption = skus[0]?.variantValues[0]?.optionName;
      const newFirstOption = options[0]?.name;
      if (oldFirstOption !== newFirstOption) {
          setExpandedGroups({});
      }
      
      // Đánh dấu đã khởi tạo sau lần đầu tiên
      isInitialized.current = true;
    } catch (error) {
      console.error('Error processing SKUs:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, initialSkus]);

  const groupedSkus = useMemo<GroupedSkus>(() => {
    if (!skus || skus.length === 0) {
      return {};
    }
    
    try {
      // Kiểm tra xem mỗi SKU có variantValues không trước khi sử dụng
      const hasValidVariantValues = skus.every(sku => 
        sku.variantValues && 
        Array.isArray(sku.variantValues) && 
        sku.variantValues.length > 0
      );
      
      if (!hasValidVariantValues) {
        console.error('Some SKUs have invalid variantValues', skus);
        return {};
      }
      
      return skus.reduce((acc, sku) => {
        try {
          // Bảo vệ truy cập vào variantValues[0]
          const groupKey = sku.variantValues[0]?.value || 'Unknown';
          
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(sku);
          return acc;
        } catch (error) {
          console.error('Error processing SKU in grouping:', sku, error);
          return acc;
        }
      }, {} as GroupedSkus);
    } catch (error) {
      console.error('Error grouping SKUs:', error);
      return {};
    }
  }, [skus]);

  // Thêm useEffect để xử lý cập nhật skus lên component cha
  useEffect(() => {
    // Bỏ qua lần mount đầu tiên
    if (!isInitialized.current) {
      return;
    }
    
    // Chỉ thông báo cập nhật khi thay đổi đến từ các hàm xử lý sự kiện nội bộ
    if (isInternalUpdate.current && skus.length > 0) {
      console.log('Notifying parent of SKU update:', skus.length);
      onUpdateSkus(skus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skus]);

  const handleSkuChange = (skuId: string, field: 'price' | 'stock', value: string) => {
    let numericValue: number;

    if (field === 'price') {
      numericValue = parsePrice(value);
    } else { // for stock
      numericValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (isNaN(numericValue)) return;

    // Đánh dấu cập nhật nội bộ
    isInternalUpdate.current = true;
    console.log(`handleSkuChange - Updating SKU ${skuId}, field: ${field}, value: ${value}`);
    
    const updatedSkus = skus.map(sku =>
      sku.id === skuId ? { ...sku, [field]: numericValue } : sku
    );
    setSkus(updatedSkus);
    // Không gọi onUpdateSkus ở đây, để useEffect xử lý
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleImageUpdate = (skuId: string, newUrl: string) => {
    console.log(`handleImageUpdate - Updating image for SKU ${skuId} to ${newUrl}`);
    
    // Đánh dấu cập nhật nội bộ
    isInternalUpdate.current = true;
    
    const updatedSkus = skus.map(sku => 
      sku.id === skuId ? { ...sku, image: newUrl } : sku
    );
    setSkus(updatedSkus);
    // Không gọi onUpdateSkus ở đây, để useEffect xử lý
  };

  return {
    skus,
    groupedSkus,
    expandedGroups,
    handleSkuChange,
    toggleGroup,
    handleImageUpdate,
  };
}