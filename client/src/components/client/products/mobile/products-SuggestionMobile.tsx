// ✅ ProductSuggestionsMobile.tsx
"use client";

interface ProductSuggestion {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function ProductSuggestionsMobile({ products }: { products: ProductSuggestion[] }) {
  return (
    <div className="bg-white p-4 mt-2">
      <h2 className="text-sm font-semibold mb-3">Gợi ý cho bạn</h2>
      <div className="grid grid-cols-2 gap-3">
        {products.map((item) => (
          <div key={item.id} className="text-sm">
            <img src={item.image} alt={item.name} className="w-full aspect-square rounded border object-cover" />
            <div className="mt-1 line-clamp-2">{item.name}</div>
            <div className="text-red-500 font-semibold">₫{item.price.toLocaleString("vi-VN")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
