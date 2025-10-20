/**
 * Các hàm chuyển đổi dữ liệu từ ClientProductDetail sang định dạng phù hợp với UI components
 */

import { ClientProductDetail } from "@/types/client.products.interface";

/**
 * Interface MediaItem cho ProductGallery
 */
export interface MediaItem {
  type: "image" | "video";
  src: string;
}

/**
 * Chuyển đổi mảng images của ClientProductDetail thành mảng MediaItem cho ProductGallery
 * Hiện tại chỉ hỗ trợ hình ảnh, trong tương lai có thể mở rộng để nhận dạng video
 * @param product ClientProductDetail chứa mảng images cần chuyển đổi
 * @returns Mảng MediaItem cho ProductGallery
 */
export function transformProductImagesToMedia(product: ClientProductDetail | null): MediaItem[] {
  if (!product || !product.images || !product.images.length) {
    return [];
  }

  // Chuyển đổi mỗi chuỗi URL thành một MediaItem
  return product.images.map((url: string) => {
    // Phát hiện loại media dựa vào định dạng file
    // Giả định rằng các URL có đuôi file ở cuối
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    
    return {
      type: isVideo ? "video" : "image", 
      src: url
    };
  });
}
