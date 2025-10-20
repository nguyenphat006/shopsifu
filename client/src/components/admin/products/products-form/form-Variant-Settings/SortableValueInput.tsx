import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SortableValueInputProps {
  id: string;
  value: string;
  index: number;
  handleValueChange: (newValue: string, index: number) => void;
  handleRemoveValue: (index: number) => void;
  handleValueBlur: () => void;
}

export function SortableValueInput({
  id,
  value,
  index,
  handleValueChange,
  handleRemoveValue,
  handleValueBlur,
}: SortableValueInputProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {value.trim() !== '' ? (
        <div {...attributes} {...listeners} className="cursor-move touch-none p-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      ) : (
        <div className="w-4 h-4 p-1 mr-2" /> // Placeholder for alignment
      )}
      <div className="relative w-full">
        <Input
          placeholder="Add another value"
          value={value}
          onChange={(e) => handleValueChange(e.target.value, index)}
          onBlur={handleValueBlur}
        />
        {value.trim() !== '' && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => handleRemoveValue(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
