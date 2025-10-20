import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import NewProductPage from './products-new-metadata'
export const metadata: Metadata = metadataConfig['/admin/products/new']

export default function Page() {
  return <NewProductPage />  // client component
}