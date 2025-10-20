'use client';
import dynamic from "next/dynamic";

const CategoryTableDynamic = dynamic(() => import("./category-Table").then(mod => mod.CategoryTable), { ssr: false });

export default function CategoryTableWrapper() {
  return <CategoryTableDynamic />;
}
