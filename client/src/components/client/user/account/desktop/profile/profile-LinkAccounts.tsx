import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function LinkedAccounts() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6 text-base py-6">
      <h2 className="font-semibold text-base text-[#121214]">Tài khoản liên kết</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGoogle size={20} className="text-red-500" />
          <span>Google</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-sm">
            Đã liên kết
          </span>
          <Button
            variant="ghost"
            className="text-gray-500 text-sm hover:underline"
          >
            Hủy liên kết
          </Button>
        </div>
      </div>

      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaZalo size={20} className="text-blue-500" />
          <span>Zalo</span>
        </div>
        <button className="text-red-500 text-sm hover:underline">
          Liên kết
        </button>
      </div> */}
    </div>
  );
}
