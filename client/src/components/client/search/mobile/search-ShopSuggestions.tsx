export default function ShopSuggestion() {
  return (
    <div className="bg-white p-3 sm:p-4 border rounded shadow-sm space-y-2">
      <h2 className="text-sm font-semibold text-gray-700">
        SHOP LIÊN QUAN ĐẾN "HOA"
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="text-sm">
            <div className="font-semibold">Lattafa Perfume Việt Nam</div>
            <div className="text-xs text-gray-500">★ 5.0 | 7,6k Followers</div>
          </div>
          <button className="ml-auto sm:ml-4 px-3 py-1 text-sm border rounded text-primary border-primary">
            Xem Shop
          </button>
        </div>

        <div className="flex gap-2 sm:gap-4 justify-center sm:justify-end">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-20 h-28 bg-gray-100 rounded shadow-inner" />
          ))}
        </div>
      </div>
    </div>
  );
}
