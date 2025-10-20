import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useUploadMediaPresign } from '@/hooks/useUploadMediaPresign';
import { toast } from 'sonner';

interface ImageObject {
  id: string; 
  url: string; 
  file?: File; 
  progress: number;
  originalIndex?: number; // Track original position for reordering
}

interface UseMediaFormProps {
  initialImageUrls: string[];
}

export function useMediaForm({ initialImageUrls }: UseMediaFormProps) {
  const [imageObjects, setImageObjects] = useState<ImageObject[]>(() => 
    initialImageUrls.map(url => ({ id: url, url, progress: 100 }))
  );
  
  const prevUrlsRef = useRef<string[]>([]);
  const lastProcessedLengthRef = useRef<number>(0); // Track last processed uploadedUrls length
  
  // Thay thế useEffect đồng bộ với initialImageUrls
  useEffect(() => {
      const currentUrls = imageObjects.map(img => img.url);
      const initialUrlsChanged = JSON.stringify(initialImageUrls) !== JSON.stringify(prevUrlsRef.current);
      
      if (initialUrlsChanged) {
          prevUrlsRef.current = initialImageUrls;
          
          setImageObjects(currentObjects => {
              // Giữ lại các files đang upload
              const uploadingObjects = currentObjects.filter(o => o.file);
              const uploadingUrls = new Set(uploadingObjects.map(o => o.url));
              
              // Lọc ra URLs mới từ parent
              const newObjectsFromUrls = initialImageUrls
                  .filter(url => !uploadingUrls.has(url))
                  .map(url => ({ id: url, url, progress: 100 }));
              
              return [...newObjectsFromUrls, ...uploadingObjects];
          });
      }
  }, [initialImageUrls]);
  
  const presignHook = useUploadMediaPresign();
  
  // Wrapper to maintain compatibility with old interface
  const uploadedUrls = presignHook.uploadedUrls;
  const isUploading = presignHook.isProcessing || presignHook.isUploading;
  const overallProgress = presignHook.progress;
  
  // Enhanced handleAddFiles that automatically uploads after processing
  const handleAddFiles = useCallback(async (files: File[]) => {
    try {
      // Step 1: Process files (compress + get presigned URLs)
      const result = await presignHook.handleAddFiles(files);
      
      // Step 2: Auto upload to S3 if processing was successful
      if (result && result.presignedData && result.presignedData.length > 0) {
        console.log('Uploading with files:', result.processedFiles.length, 'presigned data:', result.presignedData.length);
        
        // Call with explicit data to avoid state timing issues
        await presignHook.uploadToS3Multiple(result.processedFiles, result.presignedData);
      }
    } catch (error) {
      console.error('Error in handleAddFiles:', error);
    }
  }, [presignHook]);
  
  // Keep uploadFiles for compatibility
  const uploadFiles = handleAddFiles;
  
  // Keep handleRemoveFile for compatibility
  const handleRemoveFile = presignHook.handleRemoveFile;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false); // Track drag state

  useEffect(() => {
    setImageObjects(currentObjects => 
      currentObjects.map(obj => 
        obj.file ? { ...obj, progress: overallProgress } : obj
      )
    );
  }, [overallProgress]);

  // Xử lý khi có URLs mới được upload
  useEffect(() => {
    // Don't update IDs while dragging to avoid confusion
    if (isDragging) return;
    
    if (uploadedUrls.length > lastProcessedLengthRef.current) {
      // Get only new URLs since last processing
      const newUrls = uploadedUrls.slice(lastProcessedLengthRef.current);
      
      console.log('Processing new uploaded URLs:', newUrls);
      // Map từ các file đang tải lên đến URLs mới
      setImageObjects(currentObjects => {
        console.log('Current objects before update:', currentObjects.map((o: ImageObject) => ({ id: o.id, url: o.url.substring(0, 50), hasFile: !!o.file })));
        
        // Tìm các objects đang upload (có file property)
        const uploadingObjects = currentObjects.filter(obj => obj.file);
        
        // Create updated objects for new URLs
        
        // Create a new array by updating existing uploading objects with new URLs
        const updatedObjects = currentObjects.map(obj => {
          // If it's an uploading object, try to match it with a new URL
          if (obj.file) {
            const uploadingIndex = uploadingObjects.indexOf(obj);
            if (uploadingIndex !== -1 && uploadingIndex < newUrls.length) {
              // Update this uploading object with the final URL and CHANGE ID to final URL
              console.log(`Updating object: ${obj.id} with URL: ${newUrls[uploadingIndex]}`);
              return {
                id: newUrls[uploadingIndex], // Change ID to final URL (like original system)
                url: newUrls[uploadingIndex], // Final URL
                progress: 100,
                file: undefined // Remove file reference
              };
            }
          }
          // Keep non-uploading objects as-is
          return obj;
        });
        
        // Add any remaining new URLs that couldn't be matched (fallback)
        const unmatchedUrls = newUrls.slice(uploadingObjects.length);
        unmatchedUrls.forEach(url => {
          updatedObjects.push({
            id: url, // Use URL as ID like original
            url: url,
            progress: 100
          });
        });
        
        // Update last processed length
        lastProcessedLengthRef.current = uploadedUrls.length;
        
        console.log('Updated objects after processing:', updatedObjects.map((o: ImageObject) => ({ id: o.id, url: o.url.substring(0, 50), hasFile: !!o.file })));
        
        return updatedObjects;
      });
    }
  }, [uploadedUrls, isDragging]);

  const handleFileSelected = useCallback(async (files: File[]) => {
    const availableSlots = 12 - imageObjects.length;
    if (availableSlots <= 0) {
      toast.warning('Đã đạt giới hạn 12 hình ảnh.');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots).filter(f => f.type.startsWith('image/'));
    if (filesToProcess.length === 0) return;

    const newImageObjects: ImageObject[] = filesToProcess.map(file => ({
      id: `uploading-${file.name}-${Date.now()}`, // Simple ID like original
      url: URL.createObjectURL(file),
      file: file,
      progress: 0,
    }));

    setImageObjects(prev => [...prev, ...newImageObjects]);
    
    await handleAddFiles(filesToProcess);

  }, [imageObjects.length, handleAddFiles]);

  const handleImageUpload = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelected(Array.from(e.target.files));
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [handleFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelected(Array.from(e.dataTransfer.files));
    }
  }, [handleFileSelected]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedImageIds.length === 0) return;

    const uploadingFilesToRemove = imageObjects
      .filter(img => selectedImageIds.includes(img.id) && img.file)
      .map(img => img.file!);
    
    // Remove from presign hook state
    uploadingFilesToRemove.forEach(file => handleRemoveFile(file.name));

    setImageObjects(prev => prev.filter(img => !selectedImageIds.includes(img.id)));
    setSelectedImageIds([]);
    
    // Log để debug việc xóa ảnh
    console.log('Images after removal:', imageObjects.filter(img => !selectedImageIds.includes(img.id)).map(img => img.url));
  }, [imageObjects, selectedImageIds, handleRemoveFile]);

  const handleToggleSelect = useCallback((idToToggle: string) => {
    setSelectedImageIds(prev =>
      prev.includes(idToToggle)
        ? prev.filter(id => id !== idToToggle)
        : [...prev, idToToggle]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedImageIds.length === imageObjects.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(imageObjects.map(img => img.id));
    }
  }, [imageObjects, selectedImageIds.length]);

  const handleRemoveImage = useCallback(
    (id: string) => {
      const imageToRemove = imageObjects.find(img => img.id === id);
      
      // Remove from local UI state
      setImageObjects((prev) => prev.filter((img) => img.id !== id));

      // If it was an uploading file, call handleRemoveFile with its name
      if (imageToRemove && imageToRemove.file) {
        handleRemoveFile(imageToRemove.file.name);
      }
      // Note: For already uploaded files (not in the 'files' state of useUploadMedia anymore),
      // removing them from the UI is enough. If server-side deletion is needed, 
      // a separate mechanism would be required here.
    },
    [imageObjects, handleRemoveFile]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setIsDragging(false); // End drag state
      
      if (over && active.id !== over.id) {
        setImageObjects((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    []
  );

  const handleDragEnter = useCallback(() => setIsDragOver(true), []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const imagesForDisplay = useMemo(() => imageObjects.map(img => img.url), [imageObjects]);

  return {
    images: imagesForDisplay, 
    imageObjects, 
    fileInputRef,
    handleImageUpload,
    handleFileChange,
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    hoveredImageIndex,
    setHoveredImageIndex,
    selectedImages: selectedImageIds, 
    handleToggleSelect,
    handleSelectAll,
    handleRemoveSelected,
    handleDragEnd,
    handleDragStart,
    isUploading,

  };
}