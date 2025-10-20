'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CheckoutHeader() {
  const router = useRouter();
  
  return (
    <div className="lg:static sticky top-0 z-20 border-b lg:border-none">
      <div className="flex items-center justify-between lg:justify-center px-4 sm:px-6 lg:px-8 h-14 lg:h-20 max-w-[1920px] mx-auto bg-white lg:bg-transparent">
        {/* Back Button - Mobile Only */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="block">
            {/* Desktop Logo */}
            <Image 
              src="/images/logo/png-jpeg/Logo-Full-Red.png" 
              alt="Shopsifu Logo" 
              width={180} 
              height={66} 
              className="hidden lg:block"
            />
            {/* Mobile Logo */}
            <Image 
              src="/images/logo/png-jpeg/Logo-Full-Red.png" 
              alt="Shopsifu Logo" 
              width={102} 
              height={102} 
              className="block lg:hidden"
            />
          </Link>
        </div>

        {/* Spacer for mobile to center logo */}
        <div className="w-10 lg:hidden"></div>
      </div>
    </div>
  );
}
