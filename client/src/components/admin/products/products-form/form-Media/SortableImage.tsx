import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface SortableImageProps {
  id: string;
  src: string;
  index: number;
  isMainImage?: boolean;
  isDragging: boolean;
  hoveredImageIndex: number | null;
  selectedImages: string[];
  setHoveredImageIndex: (index: number | null) => void;
  handleToggleSelect: (id: string) => void;
  isUploading?: boolean;
  progress?: number;
}

export const SortableImage: React.FC<SortableImageProps> = ({
  id,
  src,
  index,
  isMainImage = false,
  isDragging,
  hoveredImageIndex,
  selectedImages,
  setHoveredImageIndex,
  handleToggleSelect,
  isUploading = false,
  progress = 0,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  const containerClasses = `
    relative rounded-lg overflow-hidden border aspect-square h-full w-full touch-none
    ${isMainImage ? 'col-span-2 row-span-2' : ''}
  `;

  const isSelected = selectedImages.includes(id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClasses}
      onMouseEnter={() => !isUploading && setHoveredImageIndex(index)}
      onMouseLeave={() => !isUploading && setHoveredImageIndex(null)}
    >
      <div {...attributes} {...listeners} className="h-full w-full">
        <Image
          src={src}
          alt={`Ảnh sản phẩm ${index}`}
          className="object-contain w-full h-full"
          width={isMainImage ? 500 : 250}
          height={isMainImage ? 500 : 250}
          draggable={false}
        />
      </div>

      {isUploading ? (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs font-semibold mt-1.5">{Math.round(progress)}%</p>
        </div>
      ) : (
        <>
          <div
            className={`absolute inset-0 bg-slate-900/20 transition-opacity duration-200 pointer-events-none ${hoveredImageIndex === index || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          </div>
          {(hoveredImageIndex === index || isSelected) && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleToggleSelect(id)}
              className="absolute top-2 left-2 bg-white/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              aria-label={`Chọn ảnh ${index}`}
            />
          )}
        </>
      )}
    </div>
  );
};
