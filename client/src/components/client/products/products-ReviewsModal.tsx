"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useUploadMedia from "@/hooks/useUploadMedia";
import { useProductReview } from "./hooks/useProductReview";
import { createProductSlug } from "@/components/client/products/shared/productSlug";
import router from "next/router";

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    productId: string;
    productName: string;
    productSlug: string;
    orderId: string;
  };
}

export function ReviewsModal({
  open,
  onOpenChange,
  product,
}: ReviewsModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  // Hook upload ảnh
  const {
    files,
    uploadedUrls,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    isUploading,
    progress,
  } = useUploadMedia();

  // Hook review
  const { createReview, loading } = useProductReview(product.productId);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (isUploading) return;

    await createReview({
      content,
      rating,
      productId: product.productId,
      orderId: product.orderId,
      medias: uploadedUrls.map((url) => ({
        url,
        type: "IMAGE" as const, // default IMAGE
      })),
    });

    // Reset sau khi gửi
    setContent("");
    setRating(5);
    handleRemoveAllFiles();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl p-4 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Đánh giá sản phẩm
          </DialogTitle>
        </DialogHeader>

        {/* Thông tin sản phẩm */}
        <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-2">
          <img
            src="/images/client/profile/cps-ant.webp"
            alt="Shop Logo"
            className="w-25 h-25 object-contain rounded-xl"
          />
          <p className="flex-1 font-medium text-gray-800 text-lg leading-snug line-clamp-2">
            {product.productName}
          </p>
        </div>

        <div className="space-y-5">
          {/* Rating chọn số sao */}
          <div className="flex w-full justify-between px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    i < rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Nội dung đánh giá */}
          <Input
            placeholder="Xin mời bạn chia sẻ một số cảm nhận của bạn về sản phẩm này..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 h-14"
          />

          {/* Upload hình ảnh */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Thêm ảnh
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) handleAddFiles(e.target.files);
                }}
                className="hidden"
              />
              {files.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveAllFiles}
                  className="text-red-500 hover:bg-red-50 rounded-xl"
                >
                  Xóa tất cả
                </Button>
              )}
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {files.map((file, idx) => (
                  <Card
                    key={idx}
                    className="relative group overflow-hidden rounded-xl border"
                  >
                    <CardContent className="p-1">
                      <img
                        src={file.preview || URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />

                      {/* Nút xoá */}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      {/* Progress từng ảnh */}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Progress
                            value={progress}
                            className="h-2 w-3/4 rounded-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              await handleSubmit(); // gọi hàm gửi đánh giá
              if (product) {
                const slug = createProductSlug(
                  product.productName,
                  product.productId
                );
                router.push(`/products/${slug}`);
              }
            }}
            disabled={isUploading || loading}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
