'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

// Define interfaces for payment methods
interface BasePaymentMethod {
  id: string;
  name: string;
  description: string;
  iconType: 'text' | 'image' | 'cards';
  bgColor?: string;
}

interface TextPaymentMethod extends BasePaymentMethod {
  iconType: 'text';
  icon: string;
}

interface ImagePaymentMethod extends BasePaymentMethod {
  iconType: 'image';
  icon: string;
}

interface CardPaymentMethod extends BasePaymentMethod {
  iconType: 'cards';
  cardIcons: Array<{icon: string, alt: string}>;
}

type PaymentMethod = TextPaymentMethod | ImagePaymentMethod | CardPaymentMethod;

// Mock data for payment methods
const paymentMethodsData: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận được hàng',
    icon: '/images/client/checkout/COD.webp',
    bgColor: 'bg-gray-100',
    iconType: 'image'
  } as ImagePaymentMethod,
  // {
  //   id: 'momo',
  //   name: 'Ví MoMo',
  //   description: 'Thanh toán qua ví điện tử MoMo',
  //   icon: '/images/client/checkout/momo_vi.webp',
  //   bgColor: 'bg-pink-50',
  //   iconType: 'image'
  // } as ImagePaymentMethod,
  {
    id: 'sepay',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp vào tài khoản shop',
    icon: '/images/client/checkout/QRCode.png',
    bgColor: 'bg-blue-100',
    iconType: 'image'
  } as ImagePaymentMethod,
  {
    id: 'vnpay',
    name: 'Ví VNPay',
    description: 'Thanh toán qua ví điện tử VNPay',
    icon: '/images/client/checkout/vnpay_vi.webp',
    bgColor: 'bg-blue-100',
    iconType: 'image'
  } as ImagePaymentMethod
];

interface PaymentMethodsProps {
  paymentMethod: string;
  handlePaymentMethodChange: (value: string) => void;
}

export function PaymentMethods({ paymentMethod, handlePaymentMethodChange }: PaymentMethodsProps) {
  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Phương thức thanh toán</CardTitle>
        <CardDescription className="text-sm font-light">
          Chọn phương thức thanh toán phù hợp với bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={paymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="space-y-3"
        >
          {paymentMethodsData.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="h-4 w-4" />
              <div className="flex-1">
                <Label htmlFor={`payment-${method.id}`} className="flex justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-medium">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </div>
                  
                  {/* Display appropriate icon based on icon type */}
                  {method.iconType === 'text' && (
                    <div className={`w-10 h-7 ${(method as TextPaymentMethod).bgColor} rounded flex items-center justify-center text-xs`}>
                      {(method as TextPaymentMethod).icon}
                    </div>
                  )}
                  
                  {method.iconType === 'image' && (
                    <div className="w-10 h-7 flex items-center justify-center">
                      <Image 
                        src={(method as ImagePaymentMethod).icon} 
                        alt={method.name}
                        width={32} 
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  )}
                  
                  {method.iconType === 'cards' && (
                    <div className="flex gap-1">
                      {(method as CardPaymentMethod).cardIcons.map((card, index) => (
                        <div key={index} className="w-7 h-5 flex items-center justify-center">
                          <Image 
                            src={card.icon} 
                            alt={card.alt}
                            width={28} 
                            height={20}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        <Alert className="mt-4 text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertTitle className="text-xs">Chú ý</AlertTitle>
          <AlertDescription className="text-xs">
            Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán thành công
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
