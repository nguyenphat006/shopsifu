"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Plus,
  Home,
  Building2,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useAddress, AddressFormValues } from "./useAdddress";
import {
  AddAddressRequest,
  UpdateAddressRequest,
} from "@/types/auth/profile.interface";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useResponsive } from "@/hooks/useResponsive";
import { SimpleAddressSelect } from "@/components/ui/simple-address-select";
import { useProvinces, useDistricts, useWards } from "@/hooks/useShipping";

export default function AddressBook() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressFormValues | null>(null);
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  const { 
    getAllAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress, 
    getAddressById,
    fetchAndMapAddresses,
    prepareAddressForEdit,
    handleSaveAddress,
    formatFullAddress,
    loading: addressLoading
  } = useAddress();
  const { isMobile } = useResponsive();

  // State cho address selection
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedWardCode, setSelectedWardCode] = useState<string>('');

  // Hooks để lấy data cho việc mapping names
  const { data: provincesData } = useProvinces();
  const { data: districtsData } = useDistricts(
    { provinceId: parseInt(selectedProvinceId) || 0 },
    !!selectedProvinceId
  );
  const { data: wardsData } = useWards(
    { districtId: parseInt(selectedDistrictId) || 0 },
    !!selectedDistrictId
  );

  const form = useForm<AddressFormValues>({
    defaultValues: {
      recipient: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      label: "",
      isDefault: false,
      provinceId: 0,
      districtId: 0,
      wardCode: "",
      type: "home",
    },
  });

  const fetchAddresses = async () => {
    const mapped = await fetchAndMapAddresses();
    setAddresses(mapped);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);
    
    // Reset form ngay lập tức
    form.reset({
      recipient: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      label: "",
      isDefault: false,
      provinceId: 0,
      districtId: 0,
      wardCode: "",
      type: "home",
    });
    
    // Reset address selection
    setSelectedProvinceId('');
    setSelectedDistrictId('');
    setSelectedWardCode('');
    
    // Mở UI ngay lập tức
    setOpen(true);
  };

  const handleEdit = async (addr: AddressFormValues) => {
    setEditingAddress(addr);
    
    // Mở UI ngay lập tức
    setOpen(true);
    
    // Set initial values từ data hiện có trước
    setSelectedProvinceId(addr.provinceId?.toString() || '');
    setSelectedDistrictId(addr.districtId?.toString() || '');
    setSelectedWardCode(addr.wardCode || '');
    form.reset(addr);
    
    // Load chi tiết và update background (không block UI)
    try {
      const { addressData, matchedIds } = await prepareAddressForEdit(addr.id!);
      
      if (addressData) {
        // Update lại values nếu API trả về data tốt hơn
        setSelectedProvinceId(matchedIds.provinceId || addr.provinceId?.toString() || '');
        setSelectedDistrictId(matchedIds.districtId || addr.districtId?.toString() || '');
        setSelectedWardCode(matchedIds.wardCode || addr.wardCode || '');
        
        // Update form với data từ API
        form.reset(addressData);
      }
    } catch (error) {
      console.error('Error loading address details:', error);
      // Giữ nguyên data ban đầu nếu có lỗi
    }
  };

  // Callback để handle address change từ SimpleAddressSelect
  const handleAddressChange = useCallback((provinceId: string, districtId: string, wardCode: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(districtId);
    setSelectedWardCode(wardCode);

    // Update form values
    const numProvinceId = parseInt(provinceId) || 0;
    const numDistrictId = parseInt(districtId) || 0;
    
    form.setValue('provinceId', numProvinceId);
    form.setValue('districtId', numDistrictId);
    form.setValue('wardCode', wardCode);

    // Update province name
    if (provincesData?.data && provinceId) {
      const province = provincesData.data.find(p => p.ProvinceID.toString() === provinceId);
      if (province) {
        form.setValue('province', province.ProvinceName);
      }
    }

    // Update district name
    if (districtsData?.data && districtId) {
      const district = districtsData.data.find(d => d.DistrictID.toString() === districtId);
      if (district) {
        form.setValue('district', district.DistrictName);
      }
    } else if (!districtId) {
      form.setValue('district', '');
    }

    // Update ward name
    if (wardsData?.data && wardCode) {
      const ward = wardsData.data.find(w => w.WardCode === wardCode);
      if (ward) {
        form.setValue('ward', ward.WardName);
      }
    } else if (!wardCode) {
      form.setValue('ward', '');
    }
  }, [form, provincesData, districtsData, wardsData]);

  const handleSave = async (data: AddressFormValues) => {
    try {
      await handleSaveAddress(data, editingAddress?.id, afterSave);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const afterSave = () => {
    setOpen(false);
    fetchAddresses();
  };

  const handleDelete = async (addr: AddressFormValues) => {
    if (!addr.id) return;
    await deleteAddress(addr.id, () => {
      fetchAddresses();
    });
  };

  const formContent = (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
        {/* Address Selection với SimpleAddressSelect */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Địa chỉ</label>
          <SimpleAddressSelect
            onAddressChange={handleAddressChange}
            initialValues={{
              provinceId: selectedProvinceId,
              districtId: selectedDistrictId,
              wardCode: selectedWardCode,
            }}
          />
        </div>

        {/* Các trường khác */}
        {[
          ["detail", "Địa chỉ chi tiết", "required"],
          ["label", "Tên gợi nhớ"],
          ["recipient", "Người nhận", "required"],
        ].map(([name, label, required]) => (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as keyof AddressFormValues}
            rules={
              required
                ? { required: `${label} không được bỏ trống` }
                : undefined
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Nhập ${label.toLowerCase()}`}
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: "Số điện thoại bắt buộc",
            pattern: {
              value: /^(0|\+84)\d{9}$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại"
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại địa chỉ</FormLabel>
              <div className="flex gap-3 border-b border-gray-200 pb-4">
                <Button
                  type="button"
                  variant={field.value === "home" ? "default" : "outline"}
                  onClick={() => field.onChange("home")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Nhà
                </Button>
                <Button
                  type="button"
                  variant={field.value === "office" ? "default" : "outline"}
                  onClick={() => field.onChange("office")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Văn phòng
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="mb-0">Đặt làm địa chỉ mặc định</FormLabel>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Hidden fields để lưu IDs */}
        <input type="hidden" {...form.register('provinceId')} />
        <input type="hidden" {...form.register('districtId')} />
        <input type="hidden" {...form.register('wardCode')} />
        <input type="hidden" {...form.register('province')} />
        <input type="hidden" {...form.register('district')} />
        <input type="hidden" {...form.register('ward')} />
      </form>
    </Form>
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-base text-[#121214]">Sổ địa chỉ</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-[#D70019]"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-[#F9F9F9] border rounded-xl p-4 flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                {addr.type === "home" ? (
                  <Home size={16} />
                ) : (
                  <Building2 size={16} />
                )}
                {addr.label || "Địa chỉ"}
              </div>
              {addr.isDefault && (
                <Badge variant="outline" className="bg-blue-100 text-[#193767]">
                  Mặc định
                </Badge>
              )}
            </div>
            <div className="text-sm font-semibold flex flex-wrap gap-1">
              <span>{addr.recipient}</span>
              <span className="text-[#000000]">|</span>
              <span>{addr.phone}</span>
            </div>
            <p className="text-sm text-[#71717A]">{formatFullAddress(addr)}</p>
            <div className="mt-auto pt-2 flex justify-end items-center gap-3 text-sm">
              <button
                disabled={addressLoading}
                onClick={() => handleDelete(addr)}
                className="text-[#1D1D20] hover:underline"
              >
                {addressLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xoá"}
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleEdit(addr)}
                className="text-[#3B82F6] hover:underline"
              >
                Cập nhật
              </button>
            </div>
          </div>
        ))}
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle>
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
              </DrawerTitle>
            </DrawerHeader>

            <div className="px-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              {formContent}
            </div>

            <DrawerFooter className="flex justify-end gap-2 mt-4">
              <Button
                onClick={form.handleSubmit(handleSave)}
                disabled={addressLoading}
              >
                {addressLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <SheetRework
          open={open}
          onOpenChange={setOpen}
          title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          subtitle="Thay đổi thông tin địa chỉ nhận hàng"
          onCancel={() => setOpen(false)}
          onConfirm={form.handleSubmit(handleSave)}
          confirmText={addressLoading ? "Đang lưu..." : "Lưu"}
          cancelText="Hủy"
        >
          {formContent}
        </SheetRework>
      )}
    </div>
  );
}
