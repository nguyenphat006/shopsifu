import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VariantInput, OptionData } from './form-VariantInput'; // Assuming OptionData is exported from VariantInput

interface SortableVariantInputProps {
  option: OptionData;
  onDelete: () => void;
  onDone: () => void;
  onEdit: () => void;
  onUpdate: (name: string, values: string[]) => void;
  isLast: boolean;
}

export function SortableVariantInput(props: SortableVariantInputProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <VariantInput {...props} dragHandleProps={{...attributes, ...listeners}} />
    </div>
  );
}
