"use client";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic"

interface CheckoutMainWrapperProps {
  cartItemIds?: string[];
}

const CheckoutWrapper = dynamic(() => import("./checkout-Main").then(mod => mod.CheckoutMainWithCleanup), {
    loading: () => <Skeleton className="w-full h-full" />,
    ssr: false,
});

export default function CheckoutMainWrapper({ cartItemIds = [] }: CheckoutMainWrapperProps) {
    console.log('🎯 CheckoutMainWrapper - Received cartItemIds:', cartItemIds);
    
    return <CheckoutWrapper cartItemIds={cartItemIds} />;
}