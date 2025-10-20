"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void; // Gọi khi nhấn Enter hoặc icon search
  placeholder?: string;
  debounce?: number; // ms, nếu muốn debounce onChange/onSearch
  icon?: React.ReactNode; // Cho phép custom icon
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: controlledValue,
  onValueChange,
  onSearch,
  placeholder = "Tìm kiếm...",
  debounce = 0,
  icon,
  className,
  onChange,
  ...rest
}) => {
  const [localValue, setLocalValue] = React.useState(controlledValue || "");
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Sync local value với controlled value khi thay đổi từ bên ngoài
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);

  // Cleanup debounce timeout khi component unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Xử lý thay đổi input - luôn update local state ngay lập tức để UX mượt
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Luôn update local state ngay lập tức để typing mượt mà
    setLocalValue(newValue);
    
    // Clear debounce timeout cũ
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Nếu có debounce, delay việc gọi onValueChange
    if (debounce > 0) {
      debounceTimeout.current = setTimeout(() => {
        onValueChange?.(newValue);
      }, debounce);
    } else {
      // Không debounce thì gọi ngay
      onValueChange?.(newValue);
    }
    
    // Gọi onChange callback nếu có
    onChange?.(e);
  };

  // Xử lý khi nhấn Enter hoặc icon search
  const handleSearch = () => {
    onSearch?.(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-4"
        {...rest}
      />
      <button
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
        tabIndex={-1}
        onClick={handleSearch}
      >
        {icon || <SearchIcon size={18} />}
      </button>
    </div>
  );
};

export default SearchInput;
