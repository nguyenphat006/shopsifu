import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Khai báo kiểu dữ liệu cho props
interface TopSellingProductsProps {
  products: { name: string; sold: number }[];
}

export function TopSellingProductsTable({ products }: TopSellingProductsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead className="text-right">Số lượng đã bán</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.sold}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}