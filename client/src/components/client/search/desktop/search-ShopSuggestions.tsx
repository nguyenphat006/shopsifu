export default function ShopSuggestion() {
  return (
    <div className="bg-white p-4 border rounded shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        SHOP LIÊN QUAN ĐẾN "HOA"
      </h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <div className="font-semibold text-sm">Lattafa Perfume Việt Nam</div>
            <div className="text-xs text-gray-500">★ 5.0 | 7,6k Followers</div>
          </div>
          <button className="ml-4 px-3 py-1 text-sm border rounded text-primary border-primary">
            Xem Shop
          </button>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-32 bg-gray-100 rounded shadow-inner" />
          ))}
        </div>
      </div>
    </div>
  );
}
