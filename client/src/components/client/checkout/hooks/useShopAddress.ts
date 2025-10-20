import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userService } from '@/services/admin/userService';
import { updateShopAddress } from '@/store/features/checkout/ordersSilde';
import { UserAddress } from '@/types/admin/user.interface';

interface UserDetailResponse {
  addresses: UserAddress[];
}

interface UseShopAddressReturn {
  loading: boolean;
  error: string | null;
  shopAddress: UserAddress | null;
  refetch: () => void;
}

export const useShopAddress = (shopId: string): UseShopAddressReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopAddress, setShopAddress] = useState<UserAddress | null>(null);
  const dispatch = useDispatch();

  const fetchShopAddress = async () => {
    if (!shopId) {
      setError('Shop ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching user detail for shopId:', shopId);
      const response = await userService.getById(shopId);
      
      console.log('User detail response:', response);
      
      if (response.data?.addresses && response.data.addresses.length > 0) {
        const addresses = response.data.addresses;
        // Ưu tiên tìm địa chỉ mặc định, nếu không có thì lấy địa chỉ đầu tiên
        const addressToUse = addresses.find(addr => addr.isDefault) || addresses[0];

        if (addressToUse) {
          setShopAddress(addressToUse);
          
          // Lưu vào Redux state
          dispatch(updateShopAddress({
            shopId,
            address: {
              provinceId: addressToUse.provinceId,
              districtId: addressToUse.districtId,
              wardCode: addressToUse.wardCode,
              province: addressToUse.province,
              district: addressToUse.district,
              ward: addressToUse.ward,
              street: addressToUse.street,
              name: addressToUse.name,
            }
          }));
          
          console.log('Shop address saved to Redux:', addressToUse);
        } else {
          setError('No valid address found for this shop');
        }
      } else {
        setError('No address found for this shop');
      }
    } catch (err: any) {
      console.error('Error fetching shop address:', err);
      setError(err.message || 'Failed to fetch shop address');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchShopAddress();
    }
  }, [shopId]);

  return {
    loading,
    error,
    shopAddress,
    refetch: fetchShopAddress,
  };
};
