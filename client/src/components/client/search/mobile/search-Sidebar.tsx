const locations = [
  "Đồng Nai",
  "TP. Hồ Chí Minh",
  "Bình Dương",
  "Bà Rịa - Vũng Tàu",
];
const categories = [
  "Nhà Cửa & Đời Sống",
  "Phụ Kiện Nữ",
  "Thời Trang Nữ",
  "Sắc Đẹp",
];
const shippingOptions = ["Nhanh", "Tiết Kiệm"];

interface SearchSidebarProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

export default function SearchSidebar({
  categoryIds = [],
  currentCategoryId,
}: SearchSidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 text-sm hidden lg:block">
      <FilterSection title="Nơi Bán" items={locations} />
      <FilterSection title="Theo Danh Mục" items={categories} />
      <FilterSection title="Đơn Vị Vận Chuyển" items={shippingOptions} />
    </aside>
  );
}

function FilterSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
