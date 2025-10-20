declare module 'react-pay-icons' {
  import { ComponentProps } from 'react';

  export type PaymentIconProps = {
    type: string;
    className?: string;
    style?: React.CSSProperties;
  };

  export const PaymentIcon: React.FC<PaymentIconProps>;
  export const PAYMENT_TYPES: Record<string, string>;
}
