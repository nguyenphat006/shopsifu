'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield, Loader2 } from 'lucide-react';
import { useShipping } from '../hooks/useShipping';
import { ShippingMethod } from '@/types/shipping.interface';


interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  currentMethod?: ShippingMethod;
  onSelectMethod: (method: ShippingMethod) => void;
  shippingMethods: ShippingMethod[];
  loading: boolean;
  error: string | null;
}

const getIcon = (iconType: 'truck' | 'package' | 'shield') => {
  switch (iconType) {
    case 'truck':
      return <Truck className="h-5 w-5" />;
    case 'package':
      return <Package className="h-5 w-5" />;
    case 'shield':
      return <Shield className="h-5 w-5" />;
    default:
      return <Truck className="h-5 w-5" />;
  }
};

export function ShippingModal({
  isOpen,
  onClose,
  shopName,
  currentMethod,
  onSelectMethod,
  shippingMethods,
  loading,
  error
}: ShippingModalProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string | undefined>(currentMethod?.id);

  useEffect(() => {
    if (isOpen) {
      setSelectedMethodId(currentMethod?.id);
    }
  }, [isOpen, currentMethod]);

  const handleConfirm = () => {
    const method = shippingMethods.find((m) => m.id === selectedMethodId);
    if (method) {
      onSelectMethod(method);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Chọn phương thức vận chuyển
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Phương thức vận chuyển liên kết với ShopSifu cho shop: <span className="font-medium">{shopName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải phương thức vận chuyển...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : shippingMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Chưa có phương thức vận chuyển khả dụng</p>
              <p className="text-sm text-gray-500">Vui lòng kiểm tra lại địa chỉ giao hàng</p>
            </div>
          ) : (
            <RadioGroup value={selectedMethodId} onValueChange={setSelectedMethodId}>
              {shippingMethods.map((method: ShippingMethod) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${selectedMethodId === method.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethodId(method.id)}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getIcon(method.icon || 'truck')}
                            <span className="font-medium text-base">
                              {method.name === 'Hàng nhẹ' ? 'Tiêu chuẩn' : 
                               method.name === 'Hàng nặng' ? 'Siêu tốc' : 
                               method.name}
                            </span>
                            <span className="text-lg font-semibold text-red-600">
                              ₫{(method.price || 0).toLocaleString()}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            {selectedMethodId === method.id ? 'Đã chọn' : 'Chọn'}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{method.estimatedTime || 'Đang cập nhật'}</span>
                          </div>
                          
                          <p className="text-sm text-gray-700">{method.description || 'Phương thức vận chuyển'}</p>
                          
                          {method.features && method.features.length > 0 && (
                            <div className="space-y-1">
                              {method.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Lưu ý về vận chuyển</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Thời gian giao hàng có thể thay đổi tùy theo điều kiện thời tiết và giao thông</li>
              <li>• Đơn hàng sẽ được xử lý trong ngày làm việc (Thứ 2 - Thứ 6)</li>
              <li>• Bạn sẽ nhận được thông báo khi đơn hàng được giao đến shipper</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Trở Lại
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
            Xác Nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
