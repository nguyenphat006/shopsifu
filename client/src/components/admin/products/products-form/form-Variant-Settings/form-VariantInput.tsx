"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableValueInput } from './SortableValueInput';

export interface OptionData {
  id: number;
  name: string;
  values: string[];
  isDone: boolean;
}

interface VariantInputProps {
  option: OptionData;
  onDelete: () => void;
  onDone: () => void;
  onEdit: () => void;
  onUpdate: (name: string, values: string[]) => void;
  isLast?: boolean;
  dragHandleProps?: Record<string, any>;
}

export function VariantInput({ 
  option,
  onDelete,
  onDone,
  onEdit,
  onUpdate,
  isLast = false,
  dragHandleProps = {}
}: VariantInputProps) {
  const [localName, setLocalName] = useState(option.name);
  const [localValues, setLocalValues] = useState<{id: string; value: string}[]>([]);
  const newValueCounter = useRef(0);

  useEffect(() => {
    setLocalName(option.name);
    const initialValues = option.values.map((value, index) => ({ 
      id: `value-${option.id}-${index}`,
      value 
    }));

    if (initialValues.length === 0 || initialValues[initialValues.length - 1].value !== "") {
      initialValues.push({ id: `new-${option.id}-${newValueCounter.current++}`, value: "" });
    }
    setLocalValues(initialValues);
  }, [option]);

  const getValuesOnly = (items: typeof localValues) => items.map(item => item.value).filter(v => v.trim() !== "");

  const handleNameChange = (newName: string) => {
    setLocalName(newName);
  };

  const handleNameBlur = () => {
    onUpdate(localName, getValuesOnly(localValues));
  };

  const handleValueChange = (newValue: string, index: number) => {
    const newValues = [...localValues];
    newValues[index].value = newValue;

    if (index === localValues.length - 1 && newValue.trim() !== "") {
      newValues.push({ id: `new-${option.id}-${newValueCounter.current++}`, value: "" });
    }
    setLocalValues(newValues);
  };

  const handleValueBlur = () => {
    onUpdate(localName, getValuesOnly(localValues));
  };

  const handleRemoveValue = (indexToRemove: number) => {
    const newValues = localValues.filter((_, index) => index !== indexToRemove);
    setLocalValues(newValues);
    onUpdate(localName, getValuesOnly(newValues));
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
      setLocalValues((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        onUpdate(localName, getValuesOnly(reorderedItems));
        return reorderedItems;
      });
    }
  };

  if (option.isDone) {
    return (
      <div className={'bg-white ' + (!isLast ? 'border-b border-slate-200' : '')}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div {...dragHandleProps} className="cursor-move touch-none">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div 
            className="flex-1 cursor-pointer"
            onClick={onEdit}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{option.name}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {option.values.map((value, idx) => (
                  <Badge key={idx} variant="secondary">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={'bg-white ' + (!isLast ? 'border-b border-slate-200' : '')}>
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div {...dragHandleProps} className="cursor-move touch-none mt-2.5">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-4">
            {/* Option name input */}
            <div className="space-y-2">
              <Label htmlFor={`option-name-${option.id}`} className="text-sm font-medium">
                Option name
              </Label>
              <Input
                id={`option-name-${option.id}`}
                placeholder="color"
                className="w-full"
                value={localName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
              />
            </div>
            
            {/* Option values input - indented */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Option values
              </Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={localValues} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {localValues.map((item, index) => (
                      <SortableValueInput
                        key={item.id}
                        id={item.id}
                        value={item.value}
                        index={index}
                        handleValueChange={handleValueChange}
                        handleRemoveValue={handleRemoveValue}
                        handleValueBlur={handleValueBlur}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onDone}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!localName || localValues.filter(v => v.value.trim() !== '').length === 0}
              >
                Done
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

