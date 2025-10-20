import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ShopsifuSocketProvider } from "@/providers/ShopsifuSocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://shopsifu.live/"),
  title: "Shopsifu Việt Nam - Sàn Thương mại Điện tử",
  description:
    "Shopsifu là sàn thương mại điện tử hiện đại, nơi bạn có thể mua sắm và bán hàng trực tuyến dễ dàng, nhanh chóng và an toàn.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://shopsifu.live/",
    siteName: "Shopsifu",
    title: "Shopsifu Việt Nam - Sàn Thương mại Điện tử",
    description:
      "Mua sắm đa dạng sản phẩm, bán hàng trực tuyến hiệu quả trên nền tảng thương mại điện tử Shopsifu.",
    images: [
      {
        url: "/banner_shopsifu.png", // 👉 thay bằng banner thực tế
        width: 1200,
        height: 630,
        alt: "Giao diện sàn thương mại điện tử Shopsifu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopsifu - Sàn Thương mại Điện tử Việt Nam",
    description:
      "Khám phá nền tảng thương mại điện tử Shopsifu: mua sắm an toàn, bán hàng nhanh chóng, trải nghiệm tối ưu.",
    images: ["/banner_shopsifu.png"],
  },
  keywords: [
    "Shopsifu",
    "sàn thương mại điện tử",
    "mua sắm trực tuyến",
    "bán hàng online",
    "website thương mại điện tử",
    "ecommerce",
    "mua bán online",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shopsifu.live/",
  },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ShopsifuSocketProvider>
        <div className={inter.className}>{children}</div>
      </ShopsifuSocketProvider>
    </ReactQueryProvider>
  );
}
