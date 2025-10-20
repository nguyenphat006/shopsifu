import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Giả lập dữ liệu cho component này
// Thực tế, bạn sẽ fetch dữ liệu từ API tại đây hoặc từ component cha
const recentOrders = [
  {
    id: "#98765",
    customer: "Nguyễn Văn A",
    total: "500,000đ",
    status: "Đã giao",
  },
  {
    id: "#98764",
    customer: "Trần Thị B",
    total: "250,000đ",
    status: "Đang giao",
  },
  {
    id: "#98763",
    customer: "Lê Văn C",
    total: "800,000đ",
    status: "Chờ xác nhận",
  },
];

export function RecentOrdersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn hàng</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead className="text-right">Tổng tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell className="text-right">{order.total}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
