export type PaymentType =
  | 'visa'
  | 'mastercard'
  | 'jcb'
  | 'unionpay'
  | 'momo';

export interface PaymentMethod {
  type: PaymentType;
  label: string;
}

export const PAYMENT_TYPES: Record<string, PaymentType> = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  JCB: 'jcb',
  UNIONPAY: 'unionpay',
  MOMO: 'momo'
};
