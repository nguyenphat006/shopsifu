import { BaseResponse, PaginationMetadata } from "./base.interface";

// ====================================
//              SUB-TYPES
// ====================================

export type MediaType = 'IMAGE' | 'VIDEO';

export interface ReviewMedia {
  id: string;
  url: string;
  type: MediaType;
  reviewId: string;
  createdAt: string;
}

export interface ReviewUser {
  id: string;
  name: string;
  avatar?: string;
}

// ====================================
//          MAIN REVIEW INTERFACE
// ====================================

export interface Review extends PaginationMetadata {
  id: string;
  content: string;
  rating: number;
  orderId: string;
  productId: string;
  userId: string;
  updateCount: number;
  createdAt: string;
  updatedAt: string;
  medias: ReviewMedia[];
  user: ReviewUser;
}

// ====================================
//          API REQUEST
// ====================================

export interface CreateReviewMediaPayload {
  url: string;
  type: MediaType;
}

export interface CreateReviewRequest {
  content: string;
  rating: number;
  productId: string;
  orderId: string;
  medias?: CreateReviewMediaPayload[];
}

export interface UpdateReviewRequest {
  content?: string;
  rating?: number;
  medias?: CreateReviewMediaPayload[]; // Assuming medias can be updated
}


// ====================================
//          API RESPONSES
// ====================================

export interface GetReviewsResponse extends BaseResponse {
  data: {
    data: Review;
  }[];
}
