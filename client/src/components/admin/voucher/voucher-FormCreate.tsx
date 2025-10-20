"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package2,
  Users,
  Star,
  Grid3X3,
  Building2,
  Tag,
  Crown,
} from "lucide-react";
import { useUserData } from "@/hooks/useGetData-UserLogin";

// Mock data cho các loại voucher
interface VoucherType {
  id: string;
  nameKey: string;
  descKey: string;
  icon: React.ElementType;
  redirect: string;
  requiredRole?: "ADMIN" | "SELLER"; // Thêm field phân quyền
}

export default function VoucherFormCreate() {
  const t = useTranslations("admin.ModuleVouchers");
  const router = useRouter();
  const userData = useUserData();

  // Kiểm tra role của user
  const isAdmin = userData?.role?.name === "ADMIN";
  const isSeller = userData?.role?.name === "SELLER";

  // Danh sách voucher cho SELLER (3 loại cơ bản)
  const sellerVoucherTypes: VoucherType[] = [
    {
      id: "shop",
      nameKey: "shopVoucher",
      descKey: "shopVoucherDesc",
      icon: ShoppingBag,
      redirect: `/admin/voucher/new?usecase=1&owner=SHOP`,
      requiredRole: "SELLER",
    },
    {
      id: "product",
      nameKey: "productVoucher",
      descKey: "productVoucherDesc",
      icon: Package2,
      redirect: `/admin/voucher/new?usecase=2&owner=SHOP`,
      requiredRole: "SELLER",
    },
    {
      id: "private",
      nameKey: "privateVoucher",
      descKey: "privateVoucherDesc",
      icon: Users,
      redirect: `/admin/voucher/new?usecase=3&owner=SHOP`,
      requiredRole: "SELLER",
    },
  ];

  // Danh sách voucher cho ADMIN (6 loại platform)
  const adminVoucherTypes: VoucherType[] = [
    {
      id: "platform",
      nameKey: "platformVoucher",
      descKey: "platformVoucherDesc",
      icon: Crown,
      redirect: `/admin/voucher/new?usecase=4&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
    {
      id: "categories",
      nameKey: "categoriesVoucher",
      descKey: "categoriesVoucherDesc",
      icon: Grid3X3,
      redirect: `/admin/voucher/new?usecase=5&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
    {
      id: "brand",
      nameKey: "brandVoucher",
      descKey: "brandVoucherDesc",
      icon: Tag,
      redirect: `/admin/voucher/new?usecase=6&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
    {
      id: "shop-admin",
      nameKey: "shopAdminVoucher",
      descKey: "shopAdminVoucherDesc",
      icon: Building2,
      redirect: `/admin/voucher/new?usecase=7&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
    {
      id: "product-admin",
      nameKey: "productAdminVoucher",
      descKey: "productAdminVoucherDesc",
      icon: Star,
      redirect: `/admin/voucher/new?usecase=8&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
    {
      id: "private-admin",
      nameKey: "privateAdminVoucher",
      descKey: "privateAdminVoucherDesc",
      icon: Users,
      redirect: `/admin/voucher/new?usecase=9&owner=PLATFORM`,
      requiredRole: "ADMIN",
    },
  ];

  // Xác định danh sách voucher hiển thị dựa trên role
  const getVoucherTypes = () => {
    if (isAdmin) {
      return adminVoucherTypes; // ADMIN thấy 6 loại platform vouchers (bao gồm cả private admin)
    } else if (isSeller) {
      return sellerVoucherTypes; // SELLER chỉ thấy 3 loại cơ bản
    }
    return []; // Không có quyền
  };

  const voucherTypes = getVoucherTypes();

  const handleRedirect = (voucherType: VoucherType) => {
    console.log(`Redirect to create ${voucherType.id} voucher`);
    router.push(voucherType.redirect);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {t("createVoucher")}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t("createVoucherDesc")}
        </p>
        {/* Hiển thị thông tin role */}
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {isAdmin
              ? "Admin - Toàn quyền"
              : isSeller
              ? "Seller - Quyền cơ bản"
              : "Không có quyền"}
          </span>
        </div>
      </div>

      {voucherTypes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Bạn không có quyền tạo voucher.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {voucherTypes.map((voucherType) => {
            const IconComponent = voucherType.icon;
            const isAdminVoucher = voucherType.requiredRole === "ADMIN";

            return (
              <Card
                key={voucherType.id}
                className={`overflow-hidden rounded-xs ${
                  isAdminVoucher
                    ? "border-red-200 bg-gradient-to-br from-red-50 to-red-100"
                    : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 flex items-start gap-3">
                      <div
                        className={`h-10 w-10 min-w-[40px] min-h-[40px] aspect-square shrink-0 flex items-center justify-center rounded-full ${
                          isAdminVoucher ? "bg-red-200" : "bg-primary/10"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            isAdminVoucher ? "text-red-600" : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold">
                          {t(voucherType.nameKey)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(voucherType.descKey)}
                        </p>
                        {isAdminVoucher && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1 w-fit">
                            Platform Voucher
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto border-t p-3 px-6 text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRedirect(voucherType)}
                        className={`px-6 ${
                          isAdminVoucher ? "bg-red-600 hover:bg-red-700" : ""
                        }`}
                      >
                        {t("create")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
