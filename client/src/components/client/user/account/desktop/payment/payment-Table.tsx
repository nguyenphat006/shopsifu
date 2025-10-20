'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ShieldCheck, HelpCircle, Lock, CreditCard } from "lucide-react"
import { useState } from 'react'
import PaymentAdd from './payment-Add'

export default function PaymentTable() {
  const t  = useTranslations()
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <div className="bg-white p-6 max-w-3xl mx-auto text-gray-800">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-1">
        {t("user.account.payment.title")}
      </h1>

      {/* Encrypted Note */}
      <p className="text-green-600 text-sm mb-6 flex items-center gap-1">
        <Lock className="w-4 h-4 mr-1" />
        {t("user.account.payment.encrypted")}
      </p>

      {/* Card Icon and Text */}
      <div className="flex flex-col items-center text-center mb-4">
        <CreditCard className="w-16 h-16 text-gray-400 mb-2" />
        <p className="text-base font-medium">
          {t("user.account.payment.fastCheckout")}
        </p>

        {/* Badges */}
        <div className="flex gap-2 mt-2">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
            {t("user.account.payment.secure")}
          </span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
            {t("user.account.payment.convenient")}
          </span>
        </div>
      </div>

      {/* Add Card Button */}
      <div className="flex justify-center mt-4 mb-4">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full"
          onClick={() => setShowAddCard(true)}
        >
          + {t("user.account.payment.addNewCard")}
        </Button>
      </div>

      <PaymentAdd open={showAddCard} onOpenChange={setShowAddCard} />

      {/* Card Logos */}
      <div className="flex justify-center items-center gap-2 mb-8 bg-white p-4 pt-0 rounded">
        {["visa", "mastercard", "amex", "discover", "maestro", "diners", "jcb"].map(
          (brand) => (
            <img
              src={`/payment-icons/${brand}.svg`}
              alt={brand}
              className="object-cover w-10 h-6 border round"
            />
          )
        )}
      </div>

      <hr className="border-gray-300 mb-6" />

      {/* Security Sections */}
      <div className="space-y-6 text-sm text-gray-700">
        {/* Section 1: Protection */}
        <div>
          <p className="text-green-700 font-semibold flex items-center mb-2">
            <ShieldCheck className="w-4 h-4 mr-1" />
            {t("user.account.payment.cardSecurityTitle")}
          </p>
          <ul className="pl-6 list-disc space-y-1">
            <li>{t("user.account.payment.compliesPCI")}</li>
            <li>{t("user.account.payment.secureInfo")}</li>
            <li>{t("user.account.payment.encryptedAgain")}</li>
            <li>{t("user.account.payment.noSellInfo")}</li>
          </ul>
        </div>

        {/* Section 2: Trusted */}
        <div>
          <p className="text-green-700 font-semibold flex items-center mb-2">
            <ShieldCheck className="w-4 h-4 mr-1" />
            {t("user.account.payment.secureTrustedTitle")}
          </p>
          <p>{t("user.account.payment.secureTrustedDesc")}</p>
          <p className="mt-1 flex items-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            {t("user.account.payment.needHelp")}{" "}
            <a href="#" className="text-blue-600 hover:underline ml-1">
              {t("user.account.payment.contactUs")}
            </a>
          </p>
        </div>

        {/* Section 3: Support */}
        <div>
          <p className="text-green-700 font-semibold flex items-center mb-2">
            <HelpCircle className="w-4 h-4 mr-1" />
            {t("user.account.payment.supportTitle")}
          </p>
          <p>{t("user.account.payment.supportDesc")}</p>
          <p className="mt-1 flex items-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            {t("user.account.payment.doubt")}{" "}
            <a href="#" className="text-blue-600 hover:underline ml-1">
              {t("user.account.payment.faq")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}