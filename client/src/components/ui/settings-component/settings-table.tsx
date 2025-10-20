import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";

export type SettingTableColumn = {
  label: string;
  value: string | React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
};

interface SettingTableProps {
  columns?: SettingTableColumn[];
  title?: React.ReactNode;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children?: React.ReactNode; // for extra rows (e.g. 2FA toggle)
  className?: string;
}

export function SettingTable({ columns = [], title, subtitle, rightAction, children, className }: SettingTableProps) {
  return (
    <Card className={cn("w-full max-w-none rounded-xl shadow-sm border border-gray-300", className)}>
      {(title || subtitle || rightAction) && (
        <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {rightAction}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {columns.map((column, index) => (
            <div
              key={index}
              onClick={column.onClick}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-[580px_1fr] px-6 py-4 gap-y-1 gap-x-6 items-start hover:bg-gray-50 first:hover:rounded-t-xl last:hover:rounded-b-xl transition-all",
                column.onClick && "cursor-pointer"
              )}
            >
              <div className="text-gray-600 text-sm font-medium flex-shrink-0 flex items-center gap-2">
                <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
                  {column.startIcon}
                </div>
                {column.label}
              </div>
              <div className="break-words text-gray-900 text-sm flex items-center justify-between">
                <div>{column.value}</div>
                <div className="w-4 h-4 text-gray-700 flex items-center justify-center">
                  {column.endIcon}
                </div>
              </div>
            </div>
          ))}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
