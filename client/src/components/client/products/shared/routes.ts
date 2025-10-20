// src/utils/routes.ts
import { createProductSlug } from './productSlug';

/**
 * Tạo URL cho trang chi tiết sản phẩm
 * @param name Tên sản phẩm
 * @param id ID sản phẩm
 * @returns URL đầy đủ đến trang chi tiết sản phẩm
 */
export function getProductUrl(name: string, id: string | number): string {
  return `/products/${createProductSlug(name, id)}`;
}
