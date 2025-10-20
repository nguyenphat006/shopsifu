import { PaymentType, PAYMENT_TYPES } from '@/types/payment.interface';
import { SocialType } from '@/components/ui/social-icons/SocialIcon';

// Types
export type FooterLink = {
  text: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  type: SocialType;
  href: string;
  colorClass: string;
  textColor: string;
};

// Data
export const footerLinks: FooterSection[] = [
  {
    title: 'Về chúng tôi',
    links: [
      { text: 'Giới thiệu ShopSiFu', href: '/about' },
      { text: 'Blog', href: '/blog' },
      { text: 'ShopSiFu Careers', href: '/careers' },
      { text: 'Tuyển dụng', href: '/jobs' },
      { text: 'Chính sách bảo mật', href: '/privacy' },
      { text: 'Điều khoản dịch vụ', href: '/terms' }
    ]
  },
  {
    title: 'Hỗ trợ & Dịch vụ',
    links: [
      { text: 'Trung tâm hỗ trợ', href: '/support' },
      { text: 'Giao hàng & Vận chuyển', href: '/shipping' },
      { text: 'Trả hàng & Hoàn tiền', href: '/returns' },
      { text: 'Phương thức thanh toán', href: '/payment' },
      { text: 'Liên hệ', href: '/contact' },
      { text: 'Báo cáo sản phẩm', href: '/report' }
    ]
  },
  {
    title: 'Thanh toán & Vận chuyển',
    links: [
      { text: 'Chính sách vận chuyển', href: '/shipping-policy' },
      { text: 'Chính sách đổi trả', href: '/return-policy' },
      { text: 'Chính sách hoàn tiền', href: '/refund-policy' },
      { text: 'Theo dõi đơn hàng', href: '/track-order' },
      { text: 'Phí vận chuyển', href: '/shipping-fees' },
      { text: 'Chính sách khiếu nại', href: '/complaints' }
    ]
  },
  {
    title: 'Kiếm tiền với ShopSiFu',
    links: [
      { text: 'Trở thành người bán', href: '/seller' },
      { text: 'Affiliate Program', href: '/affiliate' },
      { text: 'Chiết khấu & Ưu đãi', href: '/promotions' },
      { text: 'Chương trình giới thiệu', href: '/referral' },
      { text: 'Đối tác vận chuyển', href: '/logistics' },
      { text: 'Đại lý bán hàng', href: '/wholesale' }
    ]
  }
];

export const paymentTypes: PaymentType[] = [
    PAYMENT_TYPES.VISA,
    PAYMENT_TYPES.MASTERCARD,
    PAYMENT_TYPES.JCB,
    PAYMENT_TYPES.UNIONPAY,
    PAYMENT_TYPES.MOMO,
];

export const socialLinks: SocialLink[] = [
    { type: 'facebook', href: '#', colorClass: 'hover:border-[#1877F2]/30', textColor: 'text-[#1877F2]' },
    { type: 'instagram', href: '#', colorClass: 'hover:border-[#E4405F]/30', textColor: 'text-[#E4405F]' },
    { type: 'youtube', href: '#', colorClass: 'hover:border-[#FF0000]/30', textColor: 'text-[#FF0000]' },
    { type: 'mail', href: 'mailto:support@shopsifu.com', colorClass: 'hover:border-[#EA4335]/30', textColor: 'text-[#EA4335]' }
];
