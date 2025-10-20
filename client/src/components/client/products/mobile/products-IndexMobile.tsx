'use client';

import ProductGalleryMobile from './products-GalleryMobile';
import ProductInfoMobile from './products-InfoMobile';
import ProductSpecsMobile from './products-SpecMobile';
import ProductReviews from '../products-Reviews';
import ProductSuggestionsMobile from './products-SuggestionMobile';
import ProductsFooter from './products-Footer';
import ProductShopInfo from '../products-ShopInfo'
import { productMock } from './mockData';
import { slugify } from '@/utils/slugify';
import { ClientProductDetail } from "@/types/client.products.interface";
import { MediaItem, transformProductImagesToMedia } from '../shared/productTransformers';

interface Props {
  readonly slug: string;
  product?: ClientProductDetail | null;
  isLoading?: boolean;
}

export default function ProductDetailMobile({ slug, product: productData, isLoading = false }: Props) {
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }
  
  // Sử dụng real data hoặc fallback về mock data
  let productToUse;
  let media: MediaItem[];
  
  if (productData) {
    // Case 1: Có real data từ API
    productToUse = productData;
    // Biến đổi images từ API thành media format
    media = transformProductImagesToMedia(productData);
  } else {
    // Case 2: Sử dụng mock data
    productToUse = productMock;
    // Chuyển đổi mock data media sang đúng kiểu MediaItem
    media = (productMock.media || []).map(item => ({
      type: item.type === "video" ? "video" : "image",
      src: item.src
    })) as MediaItem[];
  }

  const sizes =
    productToUse?.variants?.find((v: any) => v.value === "Kích thước")?.options || [];
  const colors =
    productToUse?.variants?.find((v: any) => v.value === "Màu sắc")?.options || [];

  // Tạo product object hoàn chỉnh cho UI
  const product = {
    ...productToUse,
    sizes,
    colors,
    media,
  };

   const defaultShop = {
    id: "cool-crew-12345",
    name: "Cool Crew",
    avatar: "/images/logo/coolcrew-logo.png", // Đường dẫn hình ảnh mặc định
    isOnline: true,
    lastActive: "1 giờ trước",
    rating: 3.7,
    responseRate: 100,
    responseTime: "trong vài giờ",
    followers: 5500,
    joinedDate: "9 tháng trước",
    productsCount: 86
  };

  const handleAddToCart = (skuId: string, quantity: number) => {
    console.log('Thêm vào giỏ hàng:', { skuId, quantity });
    // Thêm logic thực tế ở đây để thêm vào giỏ hàng
  };

  const handleBuyNow = () => {
    console.log('Mua ngay');
    // Thêm logic thực tế ở đây để mua ngay
  };

  const handleChat = () => {
    console.log('Chat với shop');
    // Thêm logic thực tế ở đây để chat với shop
  };

  return (
    <div className="bg-[#f5f5f5] pb-20">
      <ProductGalleryMobile media={product.media} />
      <ProductInfoMobile product={product as any} />
      <ProductShopInfo shop={defaultShop}/>
      <ProductSpecsMobile product={product as any} />
      <ProductReviews productId={String(product.id)} />
      <ProductSuggestionsMobile products={[]} />
      <ProductsFooter 
        product={product as any}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onChat={handleChat}
      />
    </div>
  );
}