// src/utils/productSlug.ts

/**
 * Tạo slug sản phẩm từ tên và ID
 * Format: {tên-sản-phẩm}__{id}
 * Sử dụng "__" làm dấu phân tách giữa tên và ID để dễ dàng trích xuất ID UUID
 * Giữ nguyên dấu và chữ hoa, chỉ thay khoảng trắng bằng dấu -
 * @param name Tên sản phẩm
 * @param id ID sản phẩm
 * @returns Slug đã được format
 */
export function createProductSlug(name: string, id: string | number): string {
  // Thay khoảng trắng bằng dấu gạch nối, giữ nguyên dấu và chữ hoa
  const nameSlug = name.trim().replace(/\s+/g, "-");
  // Mã hóa URL để xử lý các ký tự đặc biệt nhưng vẫn giữ nguyên dấu
  const encodedNameSlug = encodeURIComponent(nameSlug);
  return `${encodedNameSlug}__${id}`;
}

/**
 * Trích xuất ID sản phẩm từ slug
 * Format slug: {tên-sản-phẩm}__{id}
 * @param slug Slug sản phẩm
 * @returns ID sản phẩm hoặc slug gốc nếu không thể trích xuất
 */
export function extractProductId(slug: string): string {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug);
    
    // Tìm ID sử dụng dấu phân tách "__"
    const parts = decodedSlug.split("__");
    
    // Nếu tìm thấy dấu phân tách "__", phần sau là ID đầy đủ
    if (parts.length === 2) {
      return parts[1];
    }
  } catch (error) {
    console.error('Error decoding slug:', slug, error);
    // Continue to fallback methods if decoding fails
  }
  
  // Xử lý URL cũ (tương thích ngược) - tìm UUID trong slug
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = slug.match(uuidPattern);
  
  if (match) {
    return match[0];
  }
  
  // Nếu không tìm thấy định dạng nào, trả về slug nguyên bản
  return slug;
}

/**
 * Trích xuất tên sản phẩm từ slug
 * Format slug: {tên-sản-phẩm}__{id}
 * @param slug Slug sản phẩm
 * @returns Tên sản phẩm đã được định dạng với dấu gạch nối thay cho khoảng trắng
 */
export function extractProductName(slug: string): string | null {
  try {
    // Decode slug first to handle URL-encoded characters
    const decodedSlug = decodeURIComponent(slug);
    
    // Tìm tên sản phẩm sử dụng dấu phân tách "__"
    const parts = decodedSlug.split("__");
    
    // Nếu tìm thấy dấu phân tách "__", phần trước là tên sản phẩm
    if (parts.length === 2) {
      return parts[0];
    }
  } catch (error) {
    console.error('Error decoding slug for name extraction:', slug, error);
  }
  
  // Không tìm thấy tên sản phẩm trong định dạng mới
  return null;
}
