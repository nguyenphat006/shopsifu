// export interface BaseResponse<T> {
//   status?: number;
//   success?: boolean;
//   statusCode?: number;
//   title?: string;
//   message?: string;
//   timestamp?: string;
//   requestId?: string;
//   data: T;
//   metadata?: PaginationMetadata;
// }

export interface BaseResponse {
  status?: number;
  success?: boolean;
  statusCode?: number;
  title?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
  data: any; // Sử dụng any thay vì generic type T
  metadata?: PaginationMetadata;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdById?: string;
}

export interface PaginationMetadata {
  totalItems?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  hasPrev?: boolean; // Added to support both naming conventions
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdById?: string;
}

/**
 * @interface BaseEntity
 * @description A base interface for all entities, containing common properties.
 */
export interface BaseEntity {
    id: string;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MediaUploadResponse {
  data: {
      url: string;
  }[];
}

/**
 * @interface PresignedFileRequest
 * @description Interface cho request để lấy presigned URL
 */
export interface PresignedFileRequest {
  filename: string;
  filesize: number;
}

/**
 * @interface PresignedUrlData
 * @description Interface cho dữ liệu presigned URL response
 */
export interface PresignedUrlData {
  originalFilename: string;
  filename: string;
  presignedUrl: string;
  url: string;
}

/**
 * @interface PresignedUrlsRequest
 * @description Interface cho request body để lấy nhiều presigned URLs
 */
export interface PresignedUrlsRequest {
  files: PresignedFileRequest[];
}

/**
 * @interface PresignedUrlsResponse
 * @description Interface cho response của presigned URLs API
 */
export interface PresignedUrlsResponse extends BaseResponse {
  data: PresignedUrlData[];
}