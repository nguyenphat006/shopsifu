'use client'
import dynamic from "next/dynamic";

const ProductsDynamic = dynamic(() => import("./products-Table").then(mod => mod.ProductsTable), { ssr: false });

export default function ProductsWrapper() {
  return <ProductsDynamic />;
}