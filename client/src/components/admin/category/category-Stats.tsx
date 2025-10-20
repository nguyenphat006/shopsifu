// "use client";
// import { useEffect, useState } from "react";
// import { mockCategoryData } from './category-MockData';
// import { useTranslations } from "next-intl";

// export function CategoryStats() {
//   const  t  = useTranslations();
//   const [stats, setStats] = useState({
//     totalCategories: 0,
//     activeCategories: 0,
//     inactiveCategories: 0,
//     rootCategories: 0,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     // Simulate API delay and calculate stats from mock data
//     setTimeout(() => {
//       const totalCategories = mockCategoryData.length;
//       // Since we removed isActive and parentName, we'll use simulated values
//       const activeCategories = Math.floor(totalCategories * 0.9); // 90% active
//       const inactiveCategories = totalCategories - activeCategories;
//       const rootCategories = Math.floor(totalCategories * 0.4); // 40% root categories
      
//       setStats({
//         totalCategories,
//         activeCategories,
//         inactiveCategories,
//         rootCategories,
//       });
//       setLoading(false);
//     }, 500);
//   }, []);

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//       <StatCard label={t("admin.category.stats.total")} value={stats.totalCategories} loading={loading} />
//       <StatCard label={t("admin.category.stats.active")} value={stats.activeCategories} loading={loading} />
//       <StatCard label={t("admin.category.stats.inactive")} value={stats.inactiveCategories} loading={loading} />
//       <StatCard label={t("admin.category.stats.root")} value={stats.rootCategories} loading={loading} />
//     </div>
//   );
// }

// function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
//   return (
//     <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col items-center justify-center">
//       <div className="text-sm text-muted-foreground mb-1">{label}</div>
//       <div className="text-2xl font-bold">{loading ? '...' : value}</div>
//     </div>
//   );
// }
