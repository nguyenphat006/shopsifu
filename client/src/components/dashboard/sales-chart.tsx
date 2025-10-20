"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Khai báo kiểu dữ liệu cho props
interface SalesChartProps {
  data: { name: string; totalSales: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Chưa có dữ liệu thống kê.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#FE2020"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#FE2020"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          // Hàm tickFormatter được điều chỉnh để thêm "đ"
          tickFormatter={(value) => `${value.toLocaleString("vi-VN")}đ`}
        />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar dataKey="totalSales" fill="#FE2020" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
