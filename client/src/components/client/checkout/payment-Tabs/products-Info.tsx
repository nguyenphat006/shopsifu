'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  selectShopProducts, 
  applyVoucher, 
  removeVoucher,
  selectAppliedVouchers, 
  selectShippingInfo,
  selectShopOrders,
  updateShippingForShop,
  updateShippingFeeForShop,
  selectCalculationResult
} from '@/store/features/checkout/ordersSilde';
import { ProductInfo, AppliedVoucherInfo } from '@/types/order.interface';
import { ShippingMethod } from '@/types/shipping.interface';
import Image from 'next/image';
import { PiStorefrontLight } from "react-icons/pi";
import { VoucherButton } from "@/components/client/checkout/shared/cart-ModalVoucher";
import { ShippingModal } from "@/components/client/checkout/shared/cart-ModalShipping";
import { useShipping } from "@/components/client/checkout/hooks/useShipping";
import { useCalculateOrder } from "@/components/client/checkout/hooks/useCalculateOrder";
import { Truck, Clock, X } from 'lucide-react';


// Header component for the product list - desktop only
function ProductHeader() {
  return (
    <div className="hidden lg:grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50 text-sm font-medium text-gray-500 border-b">
      <div className="col-span-6">Sản phẩm</div>
      <div className="col-span-2 text-center">Đơn giá</div>
      <div className="col-span-2 text-center">Số lượng</div>
      <div className="col-span-2 text-center">Thành tiền</div>
    </div>
  );
}

// Component to display a single product
function ProductItem({ item }: { item: ProductInfo }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4 py-4 lg:py-5 px-4 lg:px-6 border-b text-sm hover:bg-gray-50 transition-colors">
      {/* Mobile & Desktop: Product Info */}
      <div className="lg:col-span-6 flex items-start space-x-3 lg:space-x-4">
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
          <Image
            src={item.image || '/placeholder.png'}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-sm lg:text-base line-clamp-2">
            {item.name}
          </h3>
          <p className="text-gray-500 mt-1 text-xs lg:text-sm">
            Phân loại: {item.variation}
          </p>
          {/* Mobile Only: Price & Quantity */}
          <div className="flex items-center justify-between mt-2 lg:hidden">
            <div className="text-gray-500 text-xs">
              ₫{item.price.toLocaleString()} x {item.quantity}
            </div>
            <div className="text-primary font-medium">
              ₫{item.subtotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Only: Price, Quantity, Total */}
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700 font-medium">
          ₫{item.price.toLocaleString()}
        </div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700">{item.quantity}</div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-primary font-medium text-base">
          ₫{item.subtotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Component to display a shop and its products
function ShopSection({ shopId, products }: { shopId: string; products: ProductInfo[] }) {
  const dispatch = useDispatch();
  const appliedVouchers = useSelector(selectAppliedVouchers);
  const appliedVoucher = appliedVouchers[shopId];
  const shippingInfo = useSelector(selectShippingInfo);
  const shopOrders = useSelector(selectShopOrders);

  const currentShopOrder = shopOrders.find(order => order.shopId === shopId);
  const selectedShippingMethod = currentShopOrder?.selectedShippingMethod;

  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  
  const { shippingMethods, loading: shippingLoading, error: shippingError } = useShipping(shopId);

  const shopName = products.length > 0 ? products[0].shopName : 'Shop';
  const shopTotal = products.reduce((sum, item) => sum + item.subtotal, 0);
  const finalTotal = shopTotal - (appliedVoucher?.discountAmount || 0) + (selectedShippingMethod?.price || 0);
  const cartItemIds = products.map(p => p.id);

  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      const defaultMethod = shippingMethods[0];
      dispatch(updateShippingForShop({ shopId, shippingMethod: defaultMethod }));
      // Cập nhật phí vận chuyển vào Redux state
      dispatch(updateShippingFeeForShop({ shopId, shippingFee: defaultMethod.price }));
    }
  }, [dispatch, shopId, shippingMethods, selectedShippingMethod]);

  const handleApplyVoucher = (shopId: string, voucherInfo: AppliedVoucherInfo) => {
    dispatch(applyVoucher({ shopId, voucherInfo }));
  };

  const handleSelectShippingMethod = (method: ShippingMethod) => {
    dispatch(updateShippingForShop({ shopId, shippingMethod: method }));
    // Cập nhật phí vận chuyển khi thay đổi phương thức
    dispatch(updateShippingFeeForShop({ shopId, shippingFee: method.price }));
  };

  const handleRemoveVoucher = (shopId: string) => {
    dispatch(removeVoucher({ shopId }));
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Shop header */}
      <div className="flex items-center px-4 lg:px-6 py-3 border-b bg-white">
        <PiStorefrontLight className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm text-gray-700 font-medium">{shopName}</span>
      </div>

      {/* Products */}
      <ProductHeader />
      <div className="divide-y divide-gray-100">
        {products.map((item, index) => (
          <ProductItem key={`${shopId}-${index}`} item={item} />
        ))}
      </div>

      {/* Footer: Voucher, Shipping & Total */}
      <div className="py-4 bg-gray-50/50 border-t">
        <div className="flex flex-col gap-4">
          {/* Voucher Section */}
          <div className="">
            <VoucherButton 
              shopName={shopName} 
              onApplyVoucher={handleApplyVoucher} 
              shopId={shopId}
              cartItemIds={cartItemIds}
            />
          </div>
          
          {/* Shipping Method Section */}
          <div className="border-t border-dashed border-gray-300 pt-3 bg-[#FAFDFF] px-6">
            {shippingLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Đang tải phương thức vận chuyển...</span>
              </div>
            ) : shippingError ? (
              <div className="text-center py-4">
                <p className="text-red-600 text-sm mb-2">{shippingError}</p>
                <p className="text-xs text-gray-500">Vui lòng kiểm tra lại địa chỉ giao hàng</p>
              </div>
            ) : !selectedShippingMethod ? (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm mb-2">Chưa có phương thức vận chuyển khả dụng</p>
                <p className="text-xs text-gray-500">
                  {!shippingInfo?.districtId || !shippingInfo?.wardCode 
                    ? 'Vui lòng chọn địa chỉ giao hàng' 
                    : 'Vui lòng kiểm tra lại địa chỉ giao hàng'
                  }
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-black">Phương thức vận chuyển:</span>
                    <span className="text-sm text-black">
                      {selectedShippingMethod.name === 'Hàng nhẹ' ? 'Tiêu chuẩn' : 
                       selectedShippingMethod.name === 'Hàng nặng' ? 'Siêu tốc' : 
                       selectedShippingMethod.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[rgb(38,170,153)]">
                      <Truck className="h-4 w-4" />
                      <span>{selectedShippingMethod.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium text-sm">
                    ₫{selectedShippingMethod.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setIsShippingModalOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Thay Đổi
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Applied Voucher */}
          {appliedVoucher && (
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Voucher áp dụng:</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {appliedVoucher.code}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-green-600">
                  -₫{appliedVoucher.discountAmount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleRemoveVoucher(shopId)}
                  className="p-1 hover:bg-red-50 rounded-full transition-colors group"
                  title="Bỏ voucher"
                >
                  <X className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          )}
          {/* Total */}
          <div className="flex items-center justify-end gap-3 pt-2 px-6 border-t border-dashed">
            <span className="text-sm text-gray-600">Tổng tiền:</span>
            <span className="text-xl font-bold text-primary">
              ₫{finalTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      <ShippingModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        shopName={shopName}
        currentMethod={selectedShippingMethod || undefined}
        onSelectMethod={handleSelectShippingMethod}
        shippingMethods={shippingMethods}
        loading={shippingLoading}
        error={shippingError}
      />
    </div>
  );
}

export function ProductsInfo() {
  const shopProducts = useSelector<RootState, Record<string, ProductInfo[]>>(selectShopProducts);

  if (Object.keys(shopProducts).length === 0) {
    return <p>Không có sản phẩm nào trong giỏ hàng.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {Object.entries(shopProducts).map(([shopId, products]) => (
          <ShopSection key={shopId} shopId={shopId} products={products} />
        ))}
      </div>
    </>
  );
}