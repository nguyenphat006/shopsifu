"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectShopOrders} from '@/store/features/checkout/ordersSilde';
import { discountService } from '@/services/discountService';
import { AppliedVoucherInfo } from '@/types/order.interface';
import { Discount, GetGuestDiscountListRequest } from '@/types/discount.interface';
import { Search, Ticket, Loader2, XCircle } from 'lucide-react';

interface VoucherCardProps {
  voucher: Discount;
  onSelect: (voucher: Discount) => void;
  isSelected: boolean;
}

const VoucherCard = ({ voucher, onSelect, isSelected }: VoucherCardProps) => {
  return (
    <div
    className={`flex items-center border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-blue-500 bg-blue-50 shadow-sm"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={() => onSelect(voucher)}
  >
    {/* Icon bên trái */}
    <div className="w-12 h-12 mr-4 flex-shrink-0">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <Ticket className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  
    {/* Nội dung voucher */}
    <div className="flex-grow space-y-1">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-gray-800">{voucher.name}</h4>
        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">
          {voucher.code}
        </span>
      </div>
  
      {voucher.description && (
        <p className="text-xs text-gray-600">{voucher.description}</p>
      )}
  
      {/* Discount Value Display */}
      <div className="mb-2">
        <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
          {voucher.discountType === 'PERCENTAGE' 
            ? `Giảm ${voucher.value}%${voucher.maxDiscountValue ? ` (tối đa ${voucher.maxDiscountValue.toLocaleString('vi-VN')}₫)` : ''}` 
            : `Giảm ${voucher.value.toLocaleString('vi-VN')}₫`
          }
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
        <span className="text-gray-500">
          HSD:{" "}
          <span className="font-medium text-gray-700">
            {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
          </span>
        </span>
        {voucher.minOrderValue && (
          <span className="text-gray-500">
            Đơn tối thiểu:{" "}
            <span className="font-medium text-gray-700">
              {voucher.minOrderValue.toLocaleString("vi-VN")}₫
            </span>
          </span>
        )}
      </div>
    </div>
  </div>
  
  );
};

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher: (shopId: string, voucher: AppliedVoucherInfo) => void;
  shopId: string;
  shopName: string;
  cartItemIds: string[];
}

const VoucherModal = ({ 
  isOpen, 
  onClose, 
  onApplyVoucher, 
  shopId, 
  shopName,
  cartItemIds
}: VoucherModalProps) => {
  const [vouchers, setVouchers] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Discount | null>(null);
  const [voucherCode, setVoucherCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      const fetchVouchers = async () => {
        setLoading(true);
        setError(null);
        try {
          if (cartItemIds.length === 0) {
            setError("Không có sản phẩm nào trong giỏ hàng để áp dụng voucher.");
            setVouchers([]);
            return;
          }
          const params: GetGuestDiscountListRequest = {
            onlyShopDiscounts: true,
            cartItemIds: cartItemIds.join(','),
          };

          const response = await discountService.getGuestDiscountList(params);
          setVouchers(response.data || []);
        } catch (err) {
          setError("Không thể tải danh sách voucher. Vui lòng thử lại.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchVouchers();
    } else {
      setSelectedVoucher(null);
      setVoucherCode("");
      setError(null);
    }
  }, [isOpen, cartItemIds]);

  const handleValidateVoucher = async (code: string) => {
    if (!code) {
      toast.info("Vui lòng nhập hoặc chọn một mã voucher.");
      return;
    }

    setIsValidating(true);
    try {
      const response = await discountService.validate({ code, cartItemIds });

      if (response.data.isValid && response.data.discount && response.data.discountAmount !== undefined) {
        const appliedVoucher: AppliedVoucherInfo = {
          code: response.data.discount.code,
          discount: response.data.discount,
          discountAmount: response.data.discountAmount,
        };
        // Pass both shopId and voucher information back to the parent
        onApplyVoucher(shopId, appliedVoucher);
        toast.success(`Áp dụng voucher '${appliedVoucher.code}' thành công!`);
        onClose();
      } else {
        toast.error("Mã voucher không hợp lệ hoặc không đủ điều kiện áp dụng.");
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi xác thực voucher.");
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectAndSetCode = (voucher: Discount) => {
    setSelectedVoucher(voucher);
    setVoucherCode(voucher.code);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <p className="text-gray-500">Đang tải voucher...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
          <XCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (vouchers.length === 0) {
      return (
        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
          <Ticket className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-500">Không có voucher nào phù hợp.</p>
        </div>
      );
    }

    return vouchers.map(voucher => (
      <VoucherCard 
        key={voucher.id}
        voucher={voucher}
        onSelect={handleSelectAndSetCode} 
        isSelected={selectedVoucher?.id === voucher.id}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-md flex flex-col h-[70vh] p-0">
    <DialogHeader className="px-6 pt-6 pb-2 border-b">
      <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
        <Ticket className="w-5 h-5 text-red-500" />
        <span>Mã giảm giá của {shopName}</span>
      </DialogTitle>
    </DialogHeader>

    <div className="flex items-center gap-2 p-4">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Nhập mã voucher"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button size="sm" onClick={() => handleValidateVoucher(voucherCode)} className="min-w-[80px]" disabled={isValidating}>
        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Áp dụng"}
      </Button>
    </div>

    <div className="flex-1 overflow-y-auto p-4 items-center justify-center">
      {renderContent()}
    </div>

    <DialogFooter className="gap-2 sm:gap-2 p-4 border-t">
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Hủy
      </Button>
      <Button
        onClick={() => handleValidateVoucher(selectedVoucher!.code)}
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
        disabled={!selectedVoucher || isValidating}
      >
        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
}


export function VoucherButton({ shopName, onApplyVoucher, shopId, cartItemIds }: Omit<VoucherModalProps, 'isOpen' | 'onClose'>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 text-base">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <Ticket className="w-5 h-5 text-red-500" />
          <span className="text-black">Mã giảm giá của {shopName}</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:underline text-base"
        >
          Xem thêm voucher
        </button>
      </div>

      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopName={shopName}
        onApplyVoucher={onApplyVoucher}
        shopId={shopId}
        cartItemIds={cartItemIds}
      />
    </>
  );
}
