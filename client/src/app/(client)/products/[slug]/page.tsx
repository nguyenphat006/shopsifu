// src/app/(client)/products/[slug]/page.tsx
import { clientProductsService } from '@/services/clientProductsService';
import ProductPageWrapper from "@/components/client/products/products-Wrapper";
import { extractProductId } from '@/components/client/products/shared/productSlug';
import { Metadata, ResolvingMetadata } from 'next';

// Khai báo caching và revalidation
export const revalidate = 300; // 5 phút

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata động dựa trên dữ liệu sản phẩm
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Lấy slug từ params
  const { slug } = await params;
  
  try {
    // Trích xuất ID và fetch data
    const productId = extractProductId(slug);
    const productData = await clientProductsService.getProductDetail(productId);

    // Lấy metadata từ parent
    const previousImages = (await parent).openGraph?.images || []

    // Tạo description từ mô tả sản phẩm hoặc sử dụng mặc định
    const description = productData.description 
      ? `${productData.description.slice(0, 150)}...`
      : `Mua ${productData.name} chính hãng tại Shopsifu`;

    return {
      title: `${productData.name} | Shopsifu`,
      description,
      openGraph: {
        title: productData.name,
        description,
        images: [
          ...(productData.images || []).map(img => ({
            url: img,
            width: 800,
            height: 600,
          })),
          ...previousImages,
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: productData.name,
        description,
        images: productData.images || [],
      },
    }
  } catch (error) {
    console.error('❌ [Metadata] Error generating metadata:', error);
    return {
      title: 'Sản phẩm | Shopsifu',
      description: 'Mua sắm online tại Shopsifu',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Trích xuất ID sản phẩm từ slug (slug format: ten-san-pham-123)
    const productId = extractProductId(slug);
    console.log(`✅ [Server] Extracted product ID from slug: ${productId}`);
    
    // Fetch data cơ bản từ server sử dụng ID đã trích xuất
    const productData = await clientProductsService.getProductDetail(productId);
    console.log(`✅ [Server] Fetched product: ${productData.name} (ID: ${productData.id})`);
    
    // Truyền data đã fetch xuống client component thông qua wrapper
    return <ProductPageWrapper slug={slug} initialData={productData} />;
  } catch (error) {
    console.error('❌ [Server] Error fetching product:', error);
    // Throw error để Next.js error boundary xử lý
    throw error;
  }
}