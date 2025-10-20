"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { SortableVariantInput } from "./SortableVariantInput";
import type { OptionData } from "./form-VariantInput";
import { SKUList } from "./form-SKU";
import type { Sku } from "@/utils/variantUtils";

// Import các interface cần thiết từ products.interface.ts
import { Variant, SkuDetail } from "@/types/products.interface";

// Sử dụng Partial<SkuDetail> để phù hợp với FormSku trong useProductsForm
type FormSku = Partial<SkuDetail>;

interface VariantSettingsProps {
  variants: Variant[];
  skus: FormSku[]; // Cập nhật kiểu dữ liệu để phù hợp với FormState.skus
  setVariants: (variants: Variant[]) => void;
  updateSingleSku: (index: number, updates: Partial<FormSku>) => void;
}

export function VariantSettingsIndex({
  variants,
  skus,
  setVariants,
  updateSingleSku
}: VariantSettingsProps) {
  // Thêm ref để theo dõi nguồn thay đổi
  const isInternalChange = useRef(false);
  
  // Debug logs để xem data
  console.log('VariantSettingsIndex - Received variants:', variants);
  console.log('VariantSettingsIndex - Received skus:', skus);
  
  // Hàm xử lý cập nhật SKUs
  const handleUpdateSkus = useCallback((updatedSkus: Sku[]) => {
    // Đánh dấu đây là thay đổi nội bộ
    isInternalChange.current = true;
    
    console.log('handleUpdateSkus - START');
    console.log('handleUpdateSkus - Updating SKUs:', updatedSkus);
    console.log('handleUpdateSkus - Current API SKUs:', skus);
    
    if (!Array.isArray(updatedSkus) || updatedSkus.length === 0) {
      console.warn('handleUpdateSkus: No SKUs to update');
      return;
    }
    
    // Tạo bản sao của SKUs để theo dõi những SKUs đã cập nhật
    let updatedApiSkus: Array<any> = Array.isArray(skus) ? [...skus] : [];
    
    // Đảm bảo updatedApiSkus có độ dài đủ
    if (updatedApiSkus.length < updatedSkus.length) {
      const extraNeeded = updatedSkus.length - updatedApiSkus.length;
      console.log(`Adding ${extraNeeded} empty SKUs to match length`);
      
      for (let i = 0; i < extraNeeded; i++) {
        updatedApiSkus.push({
          id: `temp-${Date.now()}-${i}`,
          value: '',
          price: 0,
          stock: 0,
          image: ''
        });
      }
    }
    
    // Với mỗi SKU được cập nhật, tìm index tương ứng trong mảng skus và cập nhật
    updatedSkus.forEach((sku, index) => {
      try {
        // Tạo value từ variantValues để đảm bảo đúng định dạng API cần
        // Format: "Color-Size" (ví dụ: "Đen-L")
        const value = sku.variantValues.map(v => v.value).join('-');
        
        // Tìm index trong mảng skus bằng ID
        let skuIndex = -1;
        
        if (Array.isArray(skus) && skus.length > 0) {
          skuIndex = skus.findIndex(apiSku => apiSku.id === sku.id);
          
          // Nếu không tìm thấy bằng ID, sử dụng value để tìm
          if (skuIndex < 0) {
            skuIndex = skus.findIndex(apiSku => apiSku.value === value);
          }
        }
        
        // Nếu vẫn không tìm thấy, sử dụng index hiện tại
        const indexToUpdate = skuIndex >= 0 ? skuIndex : index;
        
        console.log(`Updating SKU at index ${indexToUpdate}, id: ${sku.id}, value: ${value}`);
        
        // Gọi hàm cập nhật
        updateSingleSku(indexToUpdate, {
          price: sku.price,
          stock: sku.stock,
          image: sku.image || '',
          value: value, // Sử dụng value được tạo từ variantValues
          id: sku.id // Đảm bảo ID được giữ nguyên
        });
      } catch (error) {
        console.error(`Error updating SKU at index ${index}:`, error);
      }
    });
    
    console.log('handleUpdateSkus - END');
  }, [updateSingleSku, skus]);
  // Mapping functions
  const mapVariantsToOptions = useCallback((apiVariants: any[]): OptionData[] => {
    if (!apiVariants || !apiVariants.length) {
      console.log('mapVariantsToOptions: No variants provided');
      return [];
    }
    
    console.log('mapVariantsToOptions: Mapping variants', apiVariants);
    
    return apiVariants.map((variant, index) => {
      // Kiểm tra và đảm bảo variant.options là một mảng
      const options = Array.isArray(variant.options) ? variant.options : [];
      
      return {
        id: index + 1, // Generate ID
        name: variant.value || '',
        values: options,
        isDone: true
      };
    });
  }, []);

  const mapOptionsToVariants = useCallback((options: OptionData[]): any[] => {
    return options
      .filter(option => option.isDone && option.name && option.values.length > 0)
      .map(option => ({
        value: option.name,
        options: option.values.filter(v => v.trim() !== '')
      }));
  }, []);

  // Khởi tạo state từ props
  const [options, setOptions] = useState<OptionData[]>(() => 
    mapVariantsToOptions(variants || [])
  );

  // Thêm ref để theo dõi xem options đã được khởi tạo từ variants chưa
  const initializedFromProps = useRef(false);
  
  // useEffect đầu tiên - Chỉ cập nhật từ props khi khởi tạo hoặc khi variants thay đổi từ bên ngoài
  useEffect(() => {
    // Nếu chưa khởi tạo hoặc là thay đổi từ bên ngoài (không phải do component này gây ra)
    if (!initializedFromProps.current || !isInternalChange.current) {
      console.log('Updating options from variants props');
      setOptions(mapVariantsToOptions(variants || []));
      initializedFromProps.current = true; // Đánh dấu đã khởi tạo
    }
    
    // Reset flag sau mỗi lần xử lý
    isInternalChange.current = false;
  }, [variants, mapVariantsToOptions]);

  // useEffect thứ hai - CHỈ cập nhật lên parent khi options thay đổi do user thao tác
  useEffect(() => {
    // Bỏ qua lần mount đầu tiên và khi options thay đổi do update từ variants props
    if (!initializedFromProps.current) {
      return;
    }
    
    // Chỉ cập nhật khi thay đổi đến từ các hàm xử lý sự kiện nội bộ
    // Các hàm đó sẽ set isInternalChange.current = true
    if (isInternalChange.current) {
      const currentVariants = mapOptionsToVariants(options);
      console.log('Updating parent variants from options:', currentVariants);
      setVariants(currentVariants);
      // KHÔNG reset flag ở đây, để useEffect đầu tiên xử lý
    }
  }, [options, setVariants, mapOptionsToVariants]);

  // Sửa lại các hàm xử lý để đánh dấu thay đổi nội bộ
  const handleAddOptions = () => {
    const newOption = {
      id: Date.now(), // Unique ID
      name: '',
      values: [],
      isDone: false
    };
    
    // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
    isInternalChange.current = true;
    console.log('handleAddOptions - Adding new option');
    setOptions([...options, newOption]);
  };

  const handleDelete = (optionId: number) => {
    // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
    isInternalChange.current = true;
    console.log(`handleDelete - Deleting option ${optionId}`);
    setOptions(prevOptions => prevOptions.filter(option => option.id !== optionId));
  };

  const handleDone = (optionId: number) => {
    // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
    isInternalChange.current = true;
    console.log(`handleDone - Marking option ${optionId} as done`);
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: true }
        : option
    ));
  };

  const handleEdit = (optionId: number) => {
    // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
    isInternalChange.current = true;
    console.log(`handleEdit - Editing option ${optionId}`);
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: false }
        : option
    ));
  };

  const handleUpdateOption = (optionId: number, name: string, values: string[]) => {
    // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
    isInternalChange.current = true;
    console.log(`handleUpdateOption - Updating option ${optionId} with name "${name}" and ${values.length} values`);
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, name, values }
        : option
    ));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Đánh dấu là thay đổi nội bộ TRƯỚC khi cập nhật state
      isInternalChange.current = true;
      console.log(`handleDragEnd - Reordering options: ${active.id} -> ${over.id}`);
      
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <Label className="text-sm font-medium">Variant Settings</Label>
        </div>
        
        {options.length === 0 ? (
          <div className="px-6 pb-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={handleAddOptions}
            >
              <Plus className="h-4 w-4" />
              Add options like size or color
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="border border-slate-300 rounded-lg mx-6 mb-6">
              <SortableContext items={options} strategy={verticalListSortingStrategy}>
                {options.map((option, index) => (
                  <SortableVariantInput 
                    key={option.id}
                    option={option}
                    onDelete={() => handleDelete(option.id)}
                    onDone={() => handleDone(option.id)}
                    onEdit={() => handleEdit(option.id)}
                    onUpdate={(name, values) => handleUpdateOption(option.id, name, values)}
                    isLast={index === options.length - 1}
                  />
                ))}
              </SortableContext>
              <div className="py-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOptions}
                  className="w-full justify-center gap-2 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add another option
                </Button>
              </div>
            </div>
          </DndContext>
        )}
        <SKUList 
          options={options} 
          initialSkus={skus} // Truyền SKUs từ API vào
          onUpdateSkus={handleUpdateSkus} 
        />
      </CardContent>
    </Card>
  );
}
