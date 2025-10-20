// For the form in InformationTabs
export interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  saveInfo: boolean;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string;
  deliveryMethod: string;
}

// For the Redux checkout state (commonInfo.shippingAddress)
export interface ShippingAddress {
  receiverName?: string;
  receiverPhone?: string;
  address?: string; 
  addressDetail?: string; 
  ward?: string;
  district?: string;
  province?: string;
}

// For the list of saved addresses
export interface Address {
  id: string;
  isDefault: boolean;
  receiverName: string;
  receiverPhone: string;
  addressDetail: string;
  ward: string;
  district: string;
  province: string;
  type: 'NHÀ RIÊNG' | 'VĂN PHÒNG';
}

// For the Redux checkout state (commonInfo.customerInfo)
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}