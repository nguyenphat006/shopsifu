"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useOrder } from "../useOrders";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import { 
  Download, 
  Printer, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Hash,
  Loader2,
  User,
  Receipt
} from "lucide-react";

export default function OrderBill() {
  const { id } = useParams<{ id: string }>();
  const { orderDetail, loading, fetchOrderDetail } = useOrder();
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  const handlePrint = () => {
    if (billRef.current) {
      const printContent = billRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-slate-600 text-sm">Đang tải hóa đơn...</p>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Receipt className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 text-sm font-medium">Không thể tải hóa đơn</p>
          <p className="text-slate-500 mt-1 text-xs">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  const totalAmount = orderDetail.totalPayment || orderDetail.items.reduce(
    (sum, item) => sum + item.skuPrice * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 bg-white rounded-lg p-3 shadow-sm border border-slate-200/60 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs"
        >
          <Printer className="w-3 h-3" />
          In hóa đơn
        </Button>
        <Button
          size="sm"
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 text-xs"
        >
          <Download className="w-3 h-3" />
          Xuất PDF
        </Button>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 overflow-hidden">
        <div ref={billRef} className="p-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">ShopSifu</h1>
                <p className="text-slate-500 text-xs">E-commerce Platform</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-800 mb-1">HÓA ĐƠN</h2>
              <div className="space-y-0.5 text-xs text-slate-500">
                <div className="flex items-center justify-end gap-1">
                  <Hash className="w-3 h-3" />
                  <span>#{orderDetail.id}</span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(orderDetail.createdAt), "dd/MM/yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Company Info */}
            <div className="bg-slate-50/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-blue-500" />
                Thông tin công ty
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3 h-3 flex-shrink-0 mt-0.5 text-slate-400" />
                  <span>Công ty TNHH ShopSifu</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-slate-400" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>0123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>support@shopsifu.com</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-blue-50/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-blue-500" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-8">Tên:</span>
                  <span>{orderDetail.receiver.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-8">SĐT:</span>
                  <span>{orderDetail.receiver.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-8 flex-shrink-0">Địa chỉ:</span>
                  <span className="leading-tight">{orderDetail.receiver.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Chi tiết sản phẩm</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-3 font-medium text-slate-600 text-xs w-12">STT</th>
                    <th className="text-left p-3 font-medium text-slate-600 text-xs">Sản phẩm</th>
                    <th className="text-center p-3 font-medium text-slate-600 text-xs w-20">Đơn giá</th>
                    <th className="text-center p-3 font-medium text-slate-600 text-xs w-16">SL</th>
                    <th className="text-right p-3 font-medium text-slate-600 text-xs w-24">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.items.map((item, index) => (
                    <tr key={item.id} className={`border-b border-slate-100 ${index % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                      <td className="p-3 text-slate-500 text-xs">{index + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            width={32}
                            height={32}
                            className="rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 text-xs leading-tight line-clamp-2">{item.productName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.skuValue}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center text-slate-600 text-xs">
                        {item.skuPrice.toLocaleString()}₫
                      </td>
                      <td className="p-3 text-center text-slate-600 text-xs font-medium">{item.quantity}</td>
                      <td className="p-3 text-right font-semibold text-slate-800 text-xs">
                        {(item.skuPrice * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-6">
            <div className="w-full max-w-xs">
              <div className="bg-slate-50/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-600">Tiền hàng:</span>
                  <span className="font-medium text-slate-800">
                    {orderDetail.totalItemCost?.toLocaleString() || '0'}₫
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-600">Phí vận chuyển:</span>
                  <span className="font-medium text-slate-800">
                    {orderDetail.totalShippingFee?.toLocaleString() || '0'}₫
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-slate-600">Giảm giá:</span>
                  <span className="font-medium text-red-600">
                    -{orderDetail.totalVoucherDiscount?.toLocaleString() || '0'}₫
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-800 font-semibold text-sm">Tổng cộng:</span>
                    <span className="text-blue-600 font-bold text-lg">{totalAmount.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-2 font-medium">Mã đơn hàng</p>
              <div className="bg-white p-3 rounded-md inline-block shadow-sm">
                <div className="flex flex-col items-center">
                  {/* Simple barcode representation */}
                  <div className="flex items-end justify-center mb-1.5 px-2">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 mr-px"
                        style={{
                          width: Math.random() > 0.5 ? '2px' : '1px',
                          height: Math.random() * 20 + 15 + 'px'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-700 font-semibold">{orderDetail.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-700 font-medium">
              Cảm ơn quý khách đã mua hàng tại ShopSifu!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Hóa đơn tự động • {format(new Date(), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}