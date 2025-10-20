import CategoryTableWrapper from '@/components/admin/category/category-Wrapper';
import { useTranslations } from 'next-intl';

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/admin/category']

export default function CategoryPage() {
  const t  = useTranslations("admin.ModuleCategory");
  return (
    <div className="space-y-6 p-6 bg-white h-screen">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t('title')}
        </h2>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <CategoryTableWrapper />
    </div>
  );
}

