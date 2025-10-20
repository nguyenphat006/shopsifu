'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { discountService } from '@/services/discountService';
import { Discount } from '@/types/discount.interface';
import VoucherEditWrapper from '@/components/admin/voucher/edit/edit-Wrapper';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function EditVoucherContent() {
  const params = useParams();
  const router = useRouter();
  const userData = useUserData();
  const voucherId = params.id as string;

  const [voucher, setVoucher] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch voucher data
  useEffect(() => {
    const fetchVoucher = async () => {
      if (!voucherId) {
        setError('ID voucher không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await discountService.getById(voucherId);
        
        if (response.data) {
          setVoucher(response.data);
        } else {
          setError('Không tìm thấy voucher');
        }
      } catch (err: any) {
        console.error('Error fetching voucher:', err);
        setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin voucher');
        toast.error('Có lỗi xảy ra khi tải thông tin voucher');
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [voucherId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-sm text-gray-600">Đang tải thông tin voucher...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !voucher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Không thể tải thông tin voucher
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/voucher')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const handleEditSuccess = () => {
    toast.success('Cập nhật voucher thành công!');
    router.push('/admin/voucher');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button 
            onClick={() => router.push('/admin/voucher')}
            className="hover:text-red-600"
          >
            Quản lý voucher
          </button>
          <span>/</span>
          <span>Chỉnh sửa voucher</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Chỉnh sửa voucher: {voucher.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Mã voucher: <span className="font-medium">{voucher.code}</span>
        </p>
      </div>

      {/* Edit Form */}
      <VoucherEditWrapper 
        voucher={voucher}
        userData={userData}
        onEditSuccess={handleEditSuccess}
      />
    </div>
  );
}

export default function EditVoucherPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <EditVoucherContent />
    </Suspense>
  );
}
