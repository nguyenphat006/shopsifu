// "use client"

// import * as React from "react"
// import { CalendarIcon } from "lucide-react"
// import { format as dateFormat } from "date-fns"
// import { vi } from "date-fns/locale"
// import type { DateRange as DayPickerDateRange } from "react-day-picker"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { useTranslations } from "next-intl"

// export type DateRange = {
//   from: Date
//   to?: Date
// }

// interface DateRangePickerProps {
//   date: DateRange | undefined
//   onDateChange: (date: DateRange | undefined) => void
// }

// export function DateRangePicker({ date, onDateChange }: DateRangePickerProps) {
//   const { t } = useTranslations("")
//   return (
//     <div className="grid gap-2">
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant="outline"
//             className={cn(
//               "w-full justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {dateFormat(date.from, "dd/MM/yyyy", { locale: vi })} -{" "}
//                   {dateFormat(date.to, "dd/MM/yyyy", { locale: vi })}
//                 </>
//               ) : (
//                 dateFormat(date.from, "dd/MM/yyyy", { locale: vi })
//               )
//             ) : (
//               <span>{t('admin.common.pickday')}</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date as DayPickerDateRange}
//             onSelect={(selected: DayPickerDateRange | undefined) => {
//               if (selected?.from) {
//                 onDateChange({
//                   from: selected.from,
//                   to: selected.to
//                 })
//               } else {
//                 onDateChange(undefined)
//               }
//             }}
//             numberOfMonths={2}
//             locale={vi}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }