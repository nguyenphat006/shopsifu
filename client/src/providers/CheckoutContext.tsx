'use client';

import React, { createContext, useContext, useState } from 'react';

// Types
export type ShippingMethod = 'store' | 'delivery';
export type PaymentMethod = 'cod' | 'bank' | 'momo' | 'zalopay' | 'credit';
export type CheckoutStep = 'cart' | 'information' | 'payment';

interface ReceiverInfo {
  name: string;
  phone: string;
  address: string;
}

interface ShippingAddress {
  province: string;
  district: string;
  ward: string;
  address: string;
  addressDetail?: string;
  receiverName: string;
  receiverPhone: string;
}

interface DiscountInfo {
  code: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

interface CheckoutState {
  step: CheckoutStep;
  receiverInfo: ReceiverInfo;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  discounts: DiscountInfo[];
  acceptTerms: boolean;
}

interface CheckoutContextType {
  state: CheckoutState;
  updateReceiverInfo: (info: Partial<ReceiverInfo>) => void;
  updateShippingMethod: (method: ShippingMethod) => void;
  updateShippingAddress: (address: ShippingAddress) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  addDiscount: (discount: DiscountInfo) => void;
  removeDiscount: (code: string) => void;
  setAcceptTerms: (accept: boolean) => void;
  goToStep: (step: CheckoutStep) => void;
}

const initialState: CheckoutState = {
  step: 'information',
  receiverInfo: {
    name: '',
    phone: '',
    address: '',
  },
  shippingMethod: 'delivery',
  shippingAddress: null,
  paymentMethod: null,
  discounts: [],
  acceptTerms: false,
};

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CheckoutState>(initialState);

  const updateReceiverInfo = (info: Partial<ReceiverInfo>) => {
    setState((prev) => ({
      ...prev,
      receiverInfo: {
        ...prev.receiverInfo,
        ...info,
      },
    }));
  };

  const updateShippingMethod = (method: ShippingMethod) => {
    setState((prev) => ({
      ...prev,
      shippingMethod: method,
    }));
  };

  const updateShippingAddress = (address: ShippingAddress) => {
    setState((prev) => ({
      ...prev,
      shippingAddress: address,
    }));
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setState((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const addDiscount = (discount: DiscountInfo) => {
    setState((prev) => ({
      ...prev,
      discounts: [...prev.discounts, discount],
    }));
  };

  const removeDiscount = (code: string) => {
    setState((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((d) => d.code !== code),
    }));
  };

  const setAcceptTerms = (accept: boolean) => {
    setState((prev) => ({
      ...prev,
      acceptTerms: accept,
    }));
  };

  const goToStep = (step: CheckoutStep) => {
    setState((prev) => ({
      ...prev,
      step,
    }));
  };

  const value = {
    state,
    updateReceiverInfo,
    updateShippingMethod,
    updateShippingAddress,
    updatePaymentMethod,
    addDiscount,
    removeDiscount,
    setAcceptTerms,
    goToStep,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};


// 'use client';

// import React, { createContext, useContext, useState } from 'react';

// // Types
// export type ShippingMethod = 'store' | 'delivery';
// export type PaymentMethod = 'cod' | 'bank' | 'momo' | 'zalopay' | 'credit';
// export type CheckoutStep = 'cart' | 'information' | 'payment';

// interface CustomerInfo {
//   name: string;
//   email: string;
//   phone: string;
// }

// interface ShippingAddress {
//   province: string;
//   district: string;
//   ward: string;
//   address: string;
//   addressDetail?: string;
//   receiverName: string;
//   receiverPhone: string;
// }

// interface DiscountInfo {
//   code: string;
//   amount: number;
//   type: 'fixed' | 'percentage';
// }

// interface CheckoutState {
//   step: CheckoutStep;
//   customerInfo: CustomerInfo;
//   shippingMethod: ShippingMethod;
//   shippingAddress: ShippingAddress | null;
//   paymentMethod: PaymentMethod;
//   discounts: DiscountInfo[];
//   acceptTerms: boolean;
// }

// interface CheckoutContextType {
//   state: CheckoutState;
//   updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
//   updateShippingMethod: (method: ShippingMethod) => void;
//   updateShippingAddress: (address: ShippingAddress) => void;
//   updatePaymentMethod: (method: PaymentMethod) => void;
//   addDiscount: (discount: DiscountInfo) => void;
//   removeDiscount: (code: string) => void;
//   setAcceptTerms: (accept: boolean) => void;
//   goToStep: (step: CheckoutStep) => void;
// }

// const initialState: CheckoutState = {
//   step: 'information',
//   customerInfo: {
//     name: '',
//     email: '',
//     phone: '',
//   },
//   shippingMethod: 'delivery',
//   shippingAddress: null,
//   paymentMethod: 'cod',
//   discounts: [],
//   acceptTerms: false,
// };

// export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
//   const [state, setState] = useState<CheckoutState>(initialState);

//   const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
//     setState((prev) => ({
//       ...prev,
//       customerInfo: {
//         ...prev.customerInfo,
//         ...info,
//       },
//     }));
//   };

//   const updateShippingMethod = (method: ShippingMethod) => {
//     setState((prev) => ({
//       ...prev,
//       shippingMethod: method,
//     }));
//   };

//   const updateShippingAddress = (address: ShippingAddress) => {
//     setState((prev) => ({
//       ...prev,
//       shippingAddress: address,
//     }));
//   };

//   const updatePaymentMethod = (method: PaymentMethod) => {
//     setState((prev) => ({
//       ...prev,
//       paymentMethod: method,
//     }));
//   };

//   const addDiscount = (discount: DiscountInfo) => {
//     setState((prev) => ({
//       ...prev,
//       discounts: [...prev.discounts, discount],
//     }));
//   };

//   const removeDiscount = (code: string) => {
//     setState((prev) => ({
//       ...prev,
//       discounts: prev.discounts.filter((d) => d.code !== code),
//     }));
//   };

//   const setAcceptTerms = (accept: boolean) => {
//     setState((prev) => ({
//       ...prev,
//       acceptTerms: accept,
//     }));
//   };

//   const goToStep = (step: CheckoutStep) => {
//     setState((prev) => ({
//       ...prev,
//       step,
//     }));
//   };

//   const value = {
//     state,
//     updateCustomerInfo,
//     updateShippingMethod,
//     updateShippingAddress,
//     updatePaymentMethod,
//     addDiscount,
//     removeDiscount,
//     setAcceptTerms,
//     goToStep,
//   };

//   return (
//     <CheckoutContext.Provider value={value}>
//       {children}
//     </CheckoutContext.Provider>
//   );
// };

// export const useCheckout = () => {
//   const context = useContext(CheckoutContext);
//   if (context === undefined) {
//     throw new Error('useCheckout must be used within a CheckoutProvider');
//   }
//   return context;
// };
