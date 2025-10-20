import { privateAxios, publicAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { 
  PaginationRequest, 
  BaseResponse, 
  MediaUploadResponse, 
  PresignedUrlsRequest, 
  PresignedUrlsResponse,
  PresignedFileRequest
} from '@/types/base.interface';
import { AxiosError } from 'axios';


export const baseService = {
  /**
   * Upload một hoặc nhiều file media (hình ảnh, video, etc.)
   * @param files - Danh sách file cần upload
   * @returns Promise với response chứa URLs của các file đã upload
   */
  uploadMedia: async (files: File[], signal?: AbortSignal): Promise<MediaUploadResponse> => {
    try {
      const formData = new FormData();
      
      // Thêm từng file vào form data với key "files"
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await privateAxios.post(API_ENDPOINTS.BASE.UPLOAD_MEDIA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: signal
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error uploading media:', axiosError);
      throw axiosError.response?.data || {
        message: 'Có lỗi xảy ra khi tải lên tệp',
      };
    }
  },

  /**
   * Lấy presigned URLs cho upload file trực tiếp lên S3
   * @param files - Danh sách thông tin file cần lấy presigned URL
   * @returns Promise với response chứa presigned URLs
   */
  getPresignedUrls: async (files: PresignedFileRequest[], signal?: AbortSignal): Promise<PresignedUrlsResponse> => {
    try {
      const requestBody: PresignedUrlsRequest = {
        files: files
      };

      const response = await privateAxios.post(API_ENDPOINTS.BASE.GET_PRESIGN_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: signal
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error getting presigned URLs:', axiosError);
      throw axiosError.response?.data || {
        message: 'Có lỗi xảy ra khi lấy URL upload',
      };
    }
  },

  /**
   * Upload file trực tiếp lên S3 sử dụng presigned URL
   * @param file - File cần upload
   * @param presignedUrl - Presigned URL từ server
   * @returns Promise<void>
   */
  uploadToS3: async (file: File, presignedUrl: string, signal?: AbortSignal): Promise<void> => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        signal: signal
      });

      if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  }

  
};
