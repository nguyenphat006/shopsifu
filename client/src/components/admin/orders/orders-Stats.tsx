"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Calendar,
  Info,
  Target,
  Percent,
  Activity,
  AlertTriangle,
  TrendingDown
} from "lucide-react";
import type { ManageOrder } from "@/types/order.interface";
import { manageOrderService } from "@/services/orderService";
import axios from "axios";
import { toast } from "sonner";

interface OrdersStatsProps {
  orders: ManageOrder[];
}

export function OrdersStats({ orders }: OrdersStatsProps) {
  const [statsData, setStatsData] = useState<ManageOrder[]>(orders);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  console.log('OrdersStats rendered with orders:', orders.length); // Debug log

  // Fetch orders for stats - with all data (limit 200)
  const fetchOrdersStats = async () => {
    try {
      setIsLoadingStats(true);
      
      // Lấy tất cả orders để tính toán stats
      const response = await manageOrderService.getAll(
        {
          limit: 200,
          page: 1,
        }
      );

      console.log('Stats API Response:', response); // Debug log

      if (response && response.data) {
        setStatsData(response.data);
      } else {
        // Fallback to current orders if API fails
        console.warn('No data in response, falling back to current orders');
        setStatsData(orders);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.name !== 'CanceledError') {
        console.error('Error fetching orders stats:', error);
        toast.error('Lỗi khi tải thống kê đơn hàng');
      }
      // Fallback to current orders
      setStatsData(orders);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch data riêng cho stats với limit 200
  useEffect(() => {
    fetchOrdersStats();
  }, []);

  // Cập nhật statsData khi orders prop thay đổi (fallback)
  useEffect(() => {
    if (!isLoadingStats && (!statsData || statsData.length === 0)) {
      setStatsData(orders);
    }
  }, [orders, isLoadingStats, statsData]);
  const stats = useMemo(() => {
    // Sử dụng data từ API hoặc fallback về orders prop
    const dataToUse = (statsData && statsData.length > 0) ? statsData : orders;
    
    console.log('Stats calculation using data:', dataToUse.length, 'orders'); // Debug log
    
    if (!dataToUse || dataToUse.length === 0) {
      return {
        totalOrders: 0,
        revenue: 0,
        aov: 0,
        productsSold: 0,
        uniqueCustomers: 0,
        deliveryRate: 0,
        pendingPickup: 0,
        paymentMethods: {},
        newOrders24h: 0,
        // 3 thống kê mới dựa vào response
        totalPaymentAmount: 0,
        averageOrderValue: 0,
        completionRate: 0,
        shippingEfficiency: 0,
        customerRetentionRate: 0,
        orderGrowthRate: 0,
        // 2 thống kê bổ sung
        cancelledRate: 0,
        averageOrderProcessingTime: 0
      };
    }

    // Tổng đơn hàng
    const totalOrders = dataToUse.length;

    // Doanh thu từ totalPayment (từ response API)
    const revenue = dataToUse.reduce((sum, order) => {
      return sum + (order.totalPayment || 0);
    }, 0);

    // Average Order Value dựa trên totalPayment
    const aov = totalOrders > 0 ? revenue / totalOrders : 0;

    // Tổng sản phẩm đã bán
    const productsSold = dataToUse.reduce((sum, order) => {
      if (order.items && Array.isArray(order.items)) {
        return sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
      }
      return sum;
    }, 0);

    // Khách hàng duy nhất
    const uniqueCustomers = new Set(dataToUse.map(order => order.userId)).size;

    // Tỷ lệ giao thành công
    const deliveredOrders = dataToUse.filter(order => order.status === 'DELIVERED').length;
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // Đơn chờ lấy hàng - sử dụng status có sẵn từ orders-Columns
    const pendingPickup = dataToUse.filter(order => 
      ['PENDING_PACKAGING', 'PENDING_DELIVERY'].includes(order.status)
    ).length;

    // Phân bổ phương thức thanh toán
    const paymentMethods = dataToUse.reduce((acc, order) => {
      const paymentId = order.paymentId;
      acc[paymentId] = (acc[paymentId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Đơn mới 24h qua
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const newOrders24h = dataToUse.filter(order => 
      new Date(order.createdAt) >= yesterday
    ).length;

    // 3 thống kê mới dựa vào response API
    // 1. Tổng thanh toán thực tế (từ totalPayment)
    const totalPaymentAmount = revenue;

    // 2. Tỷ lệ hoàn thành đơn hàng (DELIVERED / total)
    const completionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // 3. Hiệu quả vận chuyển (đơn đã giao / đơn đã được pickup)
    const pickedUpOrders = dataToUse.filter(order => 
      ['PENDING_DELIVERY', 'DELIVERED'].includes(order.status)
    ).length;
    const shippingEfficiency = pickedUpOrders > 0 ? (deliveredOrders / pickedUpOrders) * 100 : 0;

    // 4. Tỷ lệ giữ chân khách hàng (customers có >1 đơn / total customers)
    const customerOrderCounts = dataToUse.reduce((acc, order) => {
      acc[order.userId] = (acc[order.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
    const customerRetentionRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0;

    // 5. Tỷ lệ tăng trưởng đơn hàng (so với 7 ngày trước)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const ordersLast7Days = dataToUse.filter(order => 
      new Date(order.createdAt) >= weekAgo
    ).length;
    const ordersBeforeLast7Days = totalOrders - ordersLast7Days;
    const orderGrowthRate = ordersBeforeLast7Days > 0 ? 
      ((ordersLast7Days - ordersBeforeLast7Days) / ordersBeforeLast7Days) * 100 : 0;

    // 6. Tỷ lệ đơn hàng bị hủy
    const cancelledOrders = dataToUse.filter(order => order.status === 'CANCELLED').length;
    const cancelledRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    // 7. Thời gian xử lý đơn hàng trung bình (từ tạo đến giao thành công)
    const deliveredOrdersWithTime = dataToUse.filter(order => 
      order.status === 'DELIVERED' && order.updatedAt && order.createdAt
    );
    let averageOrderProcessingTime = 0;
    if (deliveredOrdersWithTime.length > 0) {
      const totalProcessingTime = deliveredOrdersWithTime.reduce((sum, order) => {
        const created = new Date(order.createdAt).getTime();
        const delivered = new Date(order.updatedAt).getTime();
        return sum + (delivered - created);
      }, 0);
      // Chuyển đổi từ milliseconds sang days
      averageOrderProcessingTime = totalProcessingTime / deliveredOrdersWithTime.length / (1000 * 60 * 60 * 24);
    }

    const result = {
      totalOrders,
      revenue,
      aov,
      productsSold,
      uniqueCustomers,
      deliveryRate,
      pendingPickup,
      paymentMethods,
      newOrders24h,
      // Thống kê mới
      totalPaymentAmount,
      completionRate,
      shippingEfficiency,
      customerRetentionRate,
      orderGrowthRate,
      // 2 thống kê bổ sung
      cancelledRate,
      averageOrderProcessingTime
    };

    console.log('Calculated stats:', result); // Debug log
    
    return result;
  }, [statsData, orders]);

  const paymentMethodLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'COD', color: 'bg-green-100 text-green-700' },
    2: { label: 'VNPay', color: 'bg-blue-100 text-blue-700' },
    3: { label: 'MoMo', color: 'bg-pink-100 text-pink-700' },
    4: { label: 'Bank Transfer', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <TooltipProvider>     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {/* Tổng đơn hàng */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Tổng đơn hàng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? "..." : stats.totalOrders.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số đơn hàng mà khách hàng đã đặt</p>
          </TooltipContent>
        </Tooltip>

        {/* Doanh thu thực tế (từ totalPayment) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Doanh thu thực tế
                  <Info className="h-3 w-3" />
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoadingStats ? "..." : `${stats.totalPaymentAmount.toLocaleString()}₫`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số tiền thực tế đã thanh toán từ khách hàng</p>
            <p className="text-xs text-muted-foreground mt-1">Đã bao gồm phí ship và trừ voucher giảm giá</p>
          </TooltipContent>
        </Tooltip>

        {/* Sản phẩm đã bán */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Sản phẩm đã bán
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? "..." : stats.productsSold.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tổng số sản phẩm đã bán được cho khách hàng</p>
          </TooltipContent>
        </Tooltip>

        {/* Khách hàng duy nhất */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Khách hàng duy nhất
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? "..." : stats.uniqueCustomers.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Có bao nhiêu khách hàng khác nhau đã mua hàng</p>
          </TooltipContent>
        </Tooltip>

        {/* Tỷ lệ hoàn thành đơn hàng - Card mới 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Tỷ lệ hoàn thành
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {isLoadingStats ? "..." : `${stats.completionRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tỷ lệ đơn hàng hoàn thành thành công</p>
            <p className="text-xs text-muted-foreground mt-1">Số đơn DELIVERED / Tổng số đơn</p>
          </TooltipContent>
        </Tooltip>

        {/* Hiệu quả vận chuyển - Card mới 2 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Hiệu quả vận chuyển
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingStats ? "..." : `${stats.shippingEfficiency.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hiệu quả giao hàng thành công</p>
            <p className="text-xs text-muted-foreground mt-1">Đơn đã giao / Đơn đã được shipper nhận</p>
          </TooltipContent>
        </Tooltip>

        {/* Tỷ lệ giữ chân khách hàng - Card mới 3 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Khách hàng thân thiết
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {isLoadingStats ? "..." : `${stats.customerRetentionRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tỷ lệ khách hàng mua lại</p>
            <p className="text-xs text-muted-foreground mt-1">Khách có {'>'}1 đơn hàng / Tổng số khách</p>
          </TooltipContent>
        </Tooltip>

        {/* Đơn mới 24h */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Đơn mới 24h
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {isLoadingStats ? "..." : stats.newOrders24h.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Số đơn hàng mới nhận được trong 24 giờ vừa qua</p>
          </TooltipContent>
        </Tooltip>

        {/* Tỷ lệ hủy đơn - Card bổ sung 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Tỷ lệ hủy đơn
                  <Info className="h-3 w-3" />
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {isLoadingStats ? "..." : `${stats.cancelledRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tỷ lệ đơn hàng bị hủy</p>
            <p className="text-xs text-muted-foreground mt-1">Số đơn CANCELLED / Tổng số đơn</p>
          </TooltipContent>
        </Tooltip>

        {/* Thời gian xử lý TB - Card bổ sung 2 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Thời gian xử lý TB
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {isLoadingStats ? "..." : `${stats.averageOrderProcessingTime.toFixed(1)} ngày`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thời gian trung bình để xử lý đơn hàng</p>
            <p className="text-xs text-muted-foreground mt-1">Từ lúc tạo đến lúc giao thành công</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}