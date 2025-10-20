"use client";

import { useCallback, useState } from "react";
import { reviewService } from "@/services/reviewService";
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  Review,
  GetReviewsResponse,
} from "@/types/review.interface";
import { PaginationRequest } from "@/types/base.interface";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import { t } from "i18next";

export const useProductReview = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách review theo productId
  const fetchReviews = useCallback(
    async (params?: PaginationRequest) => {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await reviewService.getReviewsByProductId(
          productId,
          params
        );
        const data: GetReviewsResponse = res.data;
        setReviews((data.data || []).map((item) => item.data));
        setTotalItems(data.metadata?.totalItems ?? 0);
      } catch (error) {
        showToast(parseApiError(error), "error");
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  // Tạo review mới
  const createReview = useCallback(
    async (payload: CreateReviewRequest) => {
      try {
        setLoading(true);
        await reviewService.createReview(payload);
        showToast(t("client.showToast.review.createSuccessful"), "success");
        await fetchReviews();
      } catch (error) {
        showToast(parseApiError(error), "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  // Cập nhật review
  const updateReview = useCallback(
    async (reviewId: string, payload: UpdateReviewRequest) => {
      try {
        setLoading(true);
        await reviewService.updateReview(reviewId, payload);
        showToast(t("client.showToast.review.updateSuccessful"), "success");
        await fetchReviews();
      } catch (error) {
        showToast(parseApiError(error), "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  // Xóa review
  const deleteReview = useCallback(
    async (reviewId: string) => {
      try {
        setLoading(true);
        await reviewService.deleteReview(reviewId);
        showToast(t("client.showToast.review.deleteSuccessful"), "success");
        await fetchReviews();
      } catch (error) {
        showToast(parseApiError(error), "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  return {
    reviews,
    totalItems,
    loading,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
