'use client';

import { useState, useCallback } from 'react';
import { baseService } from '@/services/baseService';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { PresignedFileRequest, PresignedUrlData } from '@/types/base.interface';

export interface FileWithPreview extends File {
  preview?: string;
}

// Constants from original hook
export const FILE_SIZE_LIMIT = 1; // 1MB size limit
export const FILE_SIZE_MB = 1024 * 1024; // Convert to bytes

export interface UploadPresignState {
  files: FileWithPreview[];
  presignedData: PresignedUrlData[];
  uploadedUrls: string[];
  isProcessing: boolean; // Compress + Get URLs
  isUploading: boolean;  // Upload to S3
  progress: number;
  error: string | null;
  currentStep: 'compressing' | 'getting-urls' | 'uploading' | 'idle';
}

export function useUploadMediaPresign() {
  const [state, setState] = useState<UploadPresignState>({
    files: [],
    presignedData: [],
    uploadedUrls: [],
    isProcessing: false,
    isUploading: false,
    progress: 0,
    error: null,
    currentStep: 'idle',
  });

  // Validate file size (reuse from original)
  const validateFileSize = useCallback((file: File): boolean => {
    const fileSizeMB = file.size / FILE_SIZE_MB;
    return fileSizeMB <= FILE_SIZE_LIMIT;
  }, []);
  
  // Compress image before upload (reuse from original)
  const compressImage = useCallback(async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || validateFileSize(file)) {
      return file;
    }
    
    const options = {
      maxSizeMB: FILE_SIZE_LIMIT,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB → Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  }, [validateFileSize]);

  // Get presigned URLs from server using baseService
  const getPresignedUrls = useCallback(async (files: File[]): Promise<PresignedUrlData[]> => {
    const filesRequest: PresignedFileRequest[] = files.map(file => ({
      filename: file.name,
      filesize: file.size
    }));

    const response = await baseService.getPresignedUrls(filesRequest);
    return response.data || [];
  }, []);

  // Upload file to S3 using presigned URL
  const uploadToS3 = useCallback(async (file: File, presignedUrl: string): Promise<void> => {
    await baseService.uploadToS3(file, presignedUrl);
  }, []);

  // Xử lý thêm files (compress + get presigned URLs only)
  const handleAddFiles = useCallback(async (newFiles: FileList | File[]) => {
    const filesArray = Array.from(newFiles);
    
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      progress: 0, 
      error: null,
      currentStep: 'compressing'
    }));
    
    try {
      // Step 1: Compress images (0-50%)
      setState(prev => ({ ...prev, progress: 10 }));
      
      const processedFiles = await Promise.all(filesArray.map(async (file, index) => {
        if (file.type.startsWith('image/') && file.size > FILE_SIZE_MB) {
          const compressedFile = await compressImage(file);
          
          // Update progress during compression
          const compressionProgress = 10 + (index + 1) / filesArray.length * 40;
          setState(prev => ({ ...prev, progress: compressionProgress }));
          
          const fileWithPreview = compressedFile as FileWithPreview;
          fileWithPreview.preview = URL.createObjectURL(compressedFile);
          
          if (compressedFile.size > FILE_SIZE_MB) {
            toast.warning(`Không thể nén đủ nhỏ: ${file.name}`);
          }
          
          return fileWithPreview;
        } else {
          const fileWithPreview = file as FileWithPreview;
          fileWithPreview.preview = URL.createObjectURL(file);
          return fileWithPreview;
        }
      }));

      // Step 2: Get presigned URLs (50-100%)
      setState(prev => ({ ...prev, currentStep: 'getting-urls', progress: 50 }));
      
      const presignedData = await getPresignedUrls(processedFiles);
      
      // Complete processing
      setState(prev => ({ 
        ...prev, 
        files: processedFiles,
        presignedData,
        isProcessing: false,
        progress: 100,
        currentStep: 'idle'
      }));

      toast.success(`Đã sẵn sàng tải lên ${processedFiles.length} tệp`);
      return { processedFiles, presignedData };

    } catch (error: any) {
      console.error('Processing error:', error);
      
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        progress: 0,
        error: error.message || 'Lỗi khi xử lý tệp',
        currentStep: 'idle'
      }));
      
      toast.error('Lỗi khi xử lý tệp', {
        description: error.message || 'Vui lòng thử lại sau',
      });
      
      return { processedFiles: [], presignedData: [] };
    }
  }, [compressImage, getPresignedUrls]);

  // Upload files to S3 (separate function)
  const uploadToS3Multiple = useCallback(async (files?: FileWithPreview[], presignedData?: PresignedUrlData[]) => {
    const filesToUpload = files || state.files;
    const presignedDataToUse = presignedData || state.presignedData;
    
    if (filesToUpload.length === 0 || presignedDataToUse.length === 0) {
      toast.error('Không có tệp để tải lên');
      return [];
    }

    setState(prev => ({ 
      ...prev, 
      isUploading: true, 
      progress: 0,
      error: null,
      currentStep: 'uploading'
    }));
    
    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const presignedInfo = presignedDataToUse[index];
        if (!presignedInfo) {
          throw new Error(`No presigned URL for file: ${file.name}`);
        }

        await uploadToS3(file, presignedInfo.presignedUrl);
        
        // Update progress during upload
        const uploadProgress = (index + 1) / filesToUpload.length * 100;
        setState(prev => ({ ...prev, progress: uploadProgress }));
        
        return presignedInfo.url; // Return final URL
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Complete upload
      setState(prev => ({ 
        ...prev, 
        uploadedUrls: [...prev.uploadedUrls, ...uploadedUrls],
        isUploading: false,
        progress: 100,
        currentStep: 'idle'
      }));

      toast.success(`Đã tải lên ${uploadedUrls.length} tệp thành công`);
      return uploadedUrls;

    } catch (error: any) {
      console.error('Upload error:', error);
      
      setState(prev => ({ 
        ...prev, 
        isUploading: false,
        progress: 0,
        error: error.message || 'Lỗi khi tải tệp lên',
        currentStep: 'idle'
      }));
      
      toast.error('Lỗi khi tải tệp lên', {
        description: error.message || 'Vui lòng thử lại sau',
      });
      
      return [];
    }
  }, [state.files, state.presignedData, uploadToS3]);

  // Xử lý xóa file (reuse from original)
  const handleRemoveFile = useCallback((fileName: string) => {
    setState((prev) => {
      const fileIndex = prev.files.findIndex(f => f.name === fileName);
      if (fileIndex === -1) return prev;

      const newFiles = [...prev.files];
      const fileToRemove = newFiles[fileIndex];

      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      newFiles.splice(fileIndex, 1);
      
      return {
        ...prev,
        files: newFiles,
      };
    });
  }, []);

  // Xử lý xóa tất cả files (reuse from original)
  const handleRemoveAllFiles = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      
      return {
        ...prev,
        files: [],
        uploadedUrls: [],
        presignedData: [],
        isProcessing: false,
        isUploading: false,
        progress: 0,
        error: null,
        currentStep: 'idle',
      };
    });
  }, []);

  // Upload specific files (for manual trigger)
  const uploadFiles = useCallback(async (filesToUpload?: FileWithPreview[]) => {
    const filesToProcess = filesToUpload || state.files;
    
    if (filesToProcess.length === 0) {
      return { processedFiles: [], presignedData: [] };
    }

    return handleAddFiles(filesToProcess);
  }, [state.files, handleAddFiles]);

  // Reset state (reuse from original)
  const reset = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      
      return {
        files: [],
        uploadedUrls: [],
        presignedData: [],
        isUploading: false,
        isProcessing: false,
        progress: 0,
        error: null,
        currentStep: 'idle',
      };
    });
  }, []);

  // Get progress message based on current step
  const getProgressMessage = useCallback(() => {
    switch (state.currentStep) {
      case 'compressing':
        return 'Đang nén ảnh...';
      case 'getting-urls':
        return 'Đang lấy URL upload...';
      case 'uploading':
        return 'Đang tải lên S3...';
      default:
        return '';
    }
  }, [state.currentStep]);

  return {
    files: state.files,
    uploadedUrls: state.uploadedUrls,
    presignedData: state.presignedData,
    isUploading: state.isUploading,
    isProcessing: state.isProcessing,
    progress: state.progress,
    error: state.error,
    currentStep: state.currentStep,
    progressMessage: getProgressMessage(),
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    uploadToS3Multiple,
    reset,
    validateFileSize,
    fileSizeLimit: FILE_SIZE_LIMIT,
  };
}

export default useUploadMediaPresign;