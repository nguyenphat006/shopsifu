interface ProductSuggestion {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function ProductSuggestions({ products }: { products: ProductSuggestion[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <div key={item.id} className="border rounded p-2 bg-white hover:shadow-sm transition">
            <img src={item.image} alt={item.name} className="rounded object-cover w-full h-36" />
            <p className="text-sm mt-2">{item.name}</p>
            <p className="text-red-500 font-bold text-sm">₫{item.price.toLocaleString("vi-VN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
