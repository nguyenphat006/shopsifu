"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AddressesTable() {
  const  t  = useTranslations();

  return (
    <div className="min-h-[400px] bg-white p-6 flex flex-col items-center justify-center text-center">
      {/* Location Icon */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 11.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 21c4-4 6-7.5 6-10.5a6 6 0 10-12 0C6 13.5 8 17 12 21z"
          />
        </svg>
      </div>

      {/* Message */}
      <p className="text-base font-semibold text-gray-900 mb-2">
        {t("user.account.address.noAddress")}
      </p>

      {/* Encrypted note */}
      <p className="text-sm text-green-600 mb-6 flex items-center justify-center">
        <svg
          className="w-4 h-4 mr-1 text-green-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z"
            clipRule="evenodd"
          />
        </svg>
        {t("user.account.address.encryptedNote")}
      </p>

      {/* Add new address button */}
      <Button className="bg-red-500 hover:bg-red-600 text-white text-base font-semibold px-6 py-3 rounded-full">
        {t("user.account.address.addNewAddress")}
      </Button>
    </div>
  );
}