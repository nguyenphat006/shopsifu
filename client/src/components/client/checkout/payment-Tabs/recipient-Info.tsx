'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useSelector } from 'react-redux';
import { selectShippingInfo } from '@/store/features/checkout/ordersSilde';
import { useEffect } from 'react';

interface RecipientInfoProps {
  shippingAddress: {
    addressDetail?: string;
    ward?: string;
    district?: string;
    province?: string;
    address?: string;
    receiverName: string;
    receiverPhone: string;
  };
  onEdit?: () => void;
}

export function RecipientInfo({ shippingAddress, onEdit }: RecipientInfoProps) {
  // Lấy thông tin khách hàng trực tiếp từ Redux
  const userData = useUserData();
  const shippingInfo = useSelector(selectShippingInfo);
  
  // Debug: Log shipping address và shipping info
  useEffect(() => {
    console.log('[RecipientInfo] Received shippingAddress:', shippingAddress);
    console.log('[RecipientInfo] Redux shippingInfo:', shippingInfo);
  }, [shippingAddress, shippingInfo]);
  
  // Khởi tạo thông tin khách hàng từ userData
  const customerInfo = {
    name: userData?.name || userData?.firstName + ' ' + userData?.lastName || '',
    phone: userData?.phoneNumber || '',
    email: userData?.email || ''
  };
  
  // Function to parse location value from "code|name" format
  const parseLocationName = (value?: string): string => {
    if (!value) return '';
    console.log('[RecipientInfo] Parsing location value:', value);
    const parts = value.split('|');
    return parts.length > 1 ? parts[1] : value; // Return name if available, otherwise return the original value
  };
  
  const getFullAddress = () => {
    // Log what we're working with
    console.log('[RecipientInfo] Getting full address from:', {
      addressDetail: shippingAddress.addressDetail,
      address: shippingAddress.address,
      ward: shippingAddress.ward,
      district: shippingAddress.district,
      province: shippingAddress.province,
      shippingInfo
    });
    
    // Ưu tiên sử dụng tên từ Redux shipping info nếu có
    if (shippingInfo && shippingAddress.addressDetail) {
      const parts = [
        shippingAddress.addressDetail,
        shippingInfo.wardName || parseLocationName(shippingAddress.ward),
        shippingInfo.districtName || parseLocationName(shippingAddress.district),
        shippingInfo.provinceName || parseLocationName(shippingAddress.province)
      ].filter(Boolean);
      
      console.log('[RecipientInfo] Address parts from Redux:', parts);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback: try using addressDetail + location details
    if (shippingAddress.addressDetail) {
      const parts = [
        shippingAddress.addressDetail,
        parseLocationName(shippingAddress.ward),
        parseLocationName(shippingAddress.district),
        parseLocationName(shippingAddress.province)
      ].filter(Boolean);
      
      console.log('[RecipientInfo] Address parts fallback:', parts);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback to the full address if provided
    if (shippingAddress.address && shippingAddress.address.trim() !== '') {
      return shippingAddress.address;
    }
    
    // Last resort
    return 'Chưa có địa chỉ';
  };

  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Thông tin nhận hàng</CardTitle>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-3 text-xs font-normal"
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Khách hàng</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.name}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                <span>Số điện thoại</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.phone}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                <span>Email</span>
              </div>
              <div className="pl-5 font-medium">{customerInfo.email}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>Nhận hàng tại</span>
              </div>
              <div className="pl-5 font-medium">{getFullAddress()}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Người nhận</span>
              </div>
              <div className="pl-5">
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-1.5">|</span>
                <span className="font-medium">{shippingAddress.receiverPhone}</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Khách hàng:</span>
              </div>
              <div className="font-medium">{customerInfo.name}</div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Số điện thoại:</span>
              </div>
              <div className="font-medium">{customerInfo.phone}</div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Email:</span>
              </div>
              <div className="font-medium">{customerInfo.email}</div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Nhận hàng tại:</span>
              </div>
              <div className="font-medium">{getFullAddress()}</div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Người nhận:</span>
              </div>
              <div>
                <span className="font-medium">{shippingAddress.receiverName}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="font-medium">{shippingAddress.receiverPhone || 'Chưa có số điện thoại'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
