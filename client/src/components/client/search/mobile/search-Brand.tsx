'use client';

import { useBrand } from '../useBrand';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBrand() {
  const { data: brands, loading } = useBrand();

  return (
    <div className="bg-white rounded-md shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-red-600 text-sm font-semibold uppercase">Thương hiệu nổi bật</h2>
        <Link href="/brands" className="text-sm text-muted-foreground hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {!loading &&
          brands?.map((brand) => (
            <Link
              key={brand.id}
              href={`/search?brand=${brand.id}`}
              className="flex flex-col items-center justify-center gap-2 border hover:border-red-500 transition-colors duration-200 rounded-md p-3"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full" />
                )}
              </div>
              <span className="text-sm text-center line-clamp-2 leading-tight">{brand.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
