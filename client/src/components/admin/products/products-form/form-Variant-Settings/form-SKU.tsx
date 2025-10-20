"use client";

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUploadMedia } from '@/hooks/useUploadMedia';
import { Sku, generateApiVariantName } from '@/utils/variantUtils';
import type { OptionData } from './form-VariantInput';
import { useSku, formatPrice } from './useSKU';

// Import SkuDetail từ products interface
import { SkuDetail } from '@/types/products.interface';

// Sử dụng Partial<SkuDetail> để phù hợp với FormSku trong useProductsForm
type FormSku = Partial<SkuDetail>;

interface SKUListProps {
  options: OptionData[];
  initialSkus?: FormSku[]; // Cập nhật kiểu dữ liệu để phù hợp
  onUpdateSkus: (skus: Sku[]) => void;
}

// Component con để xử lý upload ảnh cho từng SKU
interface SkuImageUploaderProps {
  skuId: string;
  imageUrl?: string;
  onUploadComplete: (skuId: string, newUrl: string) => void;
}

function SkuImageUploader({ skuId, imageUrl, onUploadComplete }: SkuImageUploaderProps) {
  const { handleAddFiles, isUploading, uploadedUrls } = useUploadMedia();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Khi có URL mới được tải lên, gọi callback để cập nhật state cha
    if (uploadedUrls.length > 0) {
      // Kiểm tra kiểu dữ liệu của uploadedUrls
      const newUrl = typeof uploadedUrls[0] === 'string' 
        ? uploadedUrls[0] 
        : (uploadedUrls[0] as any).url || '';
        
      console.log('Image uploaded:', newUrl);
      onUploadComplete(skuId, newUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedUrls]);

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleAddFiles(event.target.files);
    }
  };

  return (
    <div 
      className="relative w-12 h-12 border border-dashed border-slate-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={handleImageClick}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label={`Upload image for variant ${skuId}`}
      />
      {isUploading ? (
        <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
      ) : imageUrl ? (
        <Image src={imageUrl} alt={`Variant ${skuId}`} layout="fill" objectFit="cover" className="rounded-md" />
      ) : (
        <ImageIcon className="h-4 w-4 text-blue-500" />
      )}
    </div>
  );
}


// Thêm memo để tránh render lại không cần thiết
import React from 'react';

export const SKUList = React.memo(function SKUList({ options, initialSkus, onUpdateSkus }: SKUListProps) {
  console.log('SKUList rendered with:'); 
  console.log('Options length:', options?.length);
  console.log('Initial SKUs length:', initialSkus?.length);
  
  // In chi tiết về initialSkus (giới hạn log để tránh quá tải console)
  if (initialSkus?.length) {
    console.log(`Initial SKUs details (showing ${Math.min(5, initialSkus.length)} of ${initialSkus.length}):`);
    initialSkus.slice(0, 5).forEach((sku, index) => {
      console.log(`SKU ${index}:`, {
        id: sku.id,
        value: sku.value,
        price: sku.price,
        stock: sku.stock,
        image: sku.image ? 'has image' : 'no image'
      });
    });
  } else {
    console.log('No initial SKUs provided');
  }
  
  const skuHook = useSku({ 
    options, 
    initialSkus, 
    onUpdateSkus: React.useCallback((updatedSkus) => {
      console.log('SKUList - onUpdateSkus callback with', updatedSkus.length, 'SKUs');
      onUpdateSkus(updatedSkus);
    }, [onUpdateSkus])
  });
  
  const {
    skus,
    groupedSkus,
    expandedGroups,
    handleSkuChange,
    toggleGroup,
    handleImageUpdate,
  } = skuHook;
  
  // In chi tiết về skus sau khi xử lý
  console.log('Processed SKUs length:', skus.length);
  console.log('Grouped SKUs keys:', Object.keys(groupedSkus));

  if (skus.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 mt-4 pt-4">
       <div className="grid grid-cols-12 gap-4 mb-4 px-6 text-sm font-medium">
        <div className="col-span-6">Variant</div>
        <div className="col-span-3">Price</div>
        <div className="col-span-3">Available</div>
      </div>
      <div className="pb-6">
        <div className="border-t border-b border-slate-200">
          {Object.entries(groupedSkus).map(([groupKey, groupSkus]) => (
          <div key={groupKey} className="border-b border-slate-200 last:border-b-0">
            <button 
              type="button"
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex justify-between items-center p-4 px-6 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{groupKey}</span>
                <span className='text-sm text-muted-foreground'>{groupSkus.length} variants</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedGroups[groupKey] ? 'rotate-180' : ''}`} />
            </button>
            {expandedGroups[groupKey] && (
              <div className="py-2">
                {groupSkus.map(sku => {
                  const variantName = sku.variantValues.slice(1).map(v => v.value).join(' / ');
                  return (
                    <div key={sku.id} className="px-4 grid grid-cols-12 gap-4 items-center py-2 border-t border-slate-200 first:border-t-0 hover:bg-slate-50 transition-colors">
                      <div className="col-span-1 flex items-center justify-center">
                        <SkuImageUploader 
                          skuId={sku.id}
                          imageUrl={sku.image}
                          onUploadComplete={handleImageUpdate}
                        />
                      </div>
                      <div className="col-span-5 flex flex-col">
                        <span className="text-sm">{variantName}</span>
                        <span className="text-xs text-muted-foreground">{generateApiVariantName(sku.variantValues)}</span>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="text"
                          placeholder='0'
                          value={formatPrice(sku.price)}
                          onChange={(e) => handleSkuChange(sku.id, 'price', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          type="number"
                          placeholder='0'
                          value={sku.stock === 0 ? '' : sku.stock}
                          onChange={(e) => handleSkuChange(sku.id, 'stock', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
});