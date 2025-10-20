"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export const OrderDateFilter = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date("2020-12-01"),
    to: new Date("2025-07-22"),
  });

  const [date, setDate] = useState<DateRange | undefined>(undefined);

  return (
    <div className="my-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-2 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm w-full sm:w-fit justify-center px-3 py-2"
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
                    dateRange.to,
                    "dd/MM/yyyy"
                  )}`
                : "Chọn khoảng ngày"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[90vw] max-w-sm sm:w-auto p-0"
          align="start"
          sideOffset={8}
        >
          <Calendar
            locale={vi}
            mode="range"
            selected={dateRange}
            onSelect={(range) =>
              setDate(range ?? { from: undefined, to: undefined })
            }
            className="text-xs sm:text-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
