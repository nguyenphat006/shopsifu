"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function PaymentAdd({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const  t  = useTranslations();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Gửi dữ liệu lên server tại đây
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-6 h-6 text-gray-700" />
            <DialogTitle>{t("user.account.payment.addNewCard")}</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleAddCard} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.account.payment.cardNumber")}
            </label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                {t("user.account.payment.expiry")}
              </label>
              <Input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                {t("user.account.payment.cvc")}
              </label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="CVC"
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.account.payment.cardHolder")}
            </label>
            <Input
              type="text"
              placeholder={t("user.account.payment.cardHolderPlaceholder")}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
              disabled={loading}
            >
              {loading
                ? t("user.account.payment.processing")
                : t("user.account.payment.addNewCard")}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-2"
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}