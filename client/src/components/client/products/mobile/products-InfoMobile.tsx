"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { productMock } from "./mockData";

export default function ProductInfoMobile({ product = productMock }) {
  const colors =
    product.variants.find((v) => v.value === "Màu sắc")?.options || [];

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
  const discountPercent = Math.round(
    ((product.basePrice - product.virtualPrice) / product.basePrice) * 100
  );

  return (
    <div className="bg-white p-4 text-sm space-y-3">
      {/* Ảnh sản phẩm dạng lựa chọn biến thể */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {colors.map((color, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedColor(color);
              setCurrentIndex(index);
            }}
            className={`border rounded-sm p-[2px] ${
              selectedColor === color ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Image
              src={
                product.media[currentIndex + 1]?.type === "image"
                  ? product.media[currentIndex + 1]?.src
                  : "/images/placeholder.png"
              }
              alt={color}
              width={64}
              height={64}
              className="w-16 h-16 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Giá */}
      <div className="flex items-center gap-3">
        <span className="text-red-600 text-2xl font-bold">
          ₫{product.basePrice.toLocaleString("vi-VN")}
        </span>
        <span className="line-through text-gray-400 text-sm">
          ₫{product.virtualPrice.toLocaleString("vi-VN")}
        </span>
        <span className="text-yellow-500 text-sm font-medium">
          -{discountPercent}%
        </span>
      </div>

      {/* Đã bán + icon yêu thích */}
      <div className="flex items-center justify-between">
        <div className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-xs font-semibold">
          Yêu thích
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Đã bán 760</span>
          <Heart className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Tên sản phẩm */}
      <div className="text-base font-medium text-black leading-snug">
        {product.name}
      </div>
    </div>
  );
}
