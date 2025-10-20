"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Receipt } from "lucide-react";
import OrderDetail from "./orders-Detail";
// import OrderBill from "./orders-Bill"; // Temporarily hidden

interface OrderIndexProps {
  onBack?: () => void;
}

export default function OrderIndex({ onBack }: OrderIndexProps) {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 border-slate-300 hover:bg-slate-50 h-9 px-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Chi tiết đơn hàng #{id}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Quản lý thông tin và xuất hóa đơn
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Thông tin đơn hàng
            </TabsTrigger>
            {/* Temporarily hidden Bill tab */}
            {/* <TabsTrigger value="bill" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Hóa đơn
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <OrderDetail />
          </TabsContent>

          {/* Temporarily hidden Bill content */}
          {/* <TabsContent value="bill" className="mt-6">
            <OrderBill />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}