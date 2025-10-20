import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import StoreProvider from "@/store/StoreProvider"
import { Toast } from "@/components/ui/toastify"
import { TrustDeviceModal } from "@/components/auth/layout/trustDevice-Modal";
import { Toaster } from '@/components/ui/sonner';
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { CartProvider } from '@/providers/CartContext';
import { AuthGuard } from "@/components/auth/AuthGuard";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ChunkErrorHandler from "@/components/client/landing-page/ChunkgErrorHandler";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Shopsifu",
  description: "Mua sắm dễ dàng cùng Shopsifu",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <StoreProvider>
                <AuthGuard>
                  <Toast/>
                  <TrustDeviceModal />
                  <CartProvider>
                    {children}
                  </CartProvider>
                </AuthGuard>
                <Toaster position="bottom-right" />
                <ChunkErrorHandler />
              {/* </ClientLayout> */}
            </StoreProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
