import { publicAxios, privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { PaginationRequest } from '@/types/base.interface';
import {
  CreateReviewRequest,
  GetReviewsResponse,
  Review,
  UpdateReviewRequest,
} from '@/types/review.interface';

export const reviewService = {
  // Lấy danh sách review theo ID sản phẩm, có phân trang
  getReviewsByProductId: (productId: string, params?: PaginationRequest) => {
    const url = API_ENDPOINTS.REVIEW.GET_BY_ID.replace(':productId', productId);
    return privateAxios.get<GetReviewsResponse>(url, { params });
  },

  // Tạo một review mới
  createReview: (payload: CreateReviewRequest) => {
    // Giả sử review cần xác thực nên dùng privateAxios
    return privateAxios.post<Review>(API_ENDPOINTS.REVIEW.CREATE, payload);
  },

  // Cập nhật một review đã có
  updateReview: (reviewId: string, payload: UpdateReviewRequest) => {
    const url = API_ENDPOINTS.REVIEW.UPDATE.replace(':reviewId', reviewId);
    return privateAxios.patch<Review>(url, payload);
  },

  // Xóa một review
  deleteReview: (reviewId: string) => {
    const url = API_ENDPOINTS.REVIEW.DELETE.replace(':reviewId', reviewId);
    return privateAxios.delete(url);
  },
};
