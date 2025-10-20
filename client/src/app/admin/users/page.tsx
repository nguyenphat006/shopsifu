'use client'
import UserTableWrapper from "@/components/admin/users/users-Wrapper";
import { useTranslations } from "next-intl";

export default function UsersPage() {
  const t = useTranslations()

  return(
   <div className="space-y-6 p-6 bg-white h-screen">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{t("admin.users.title")}</h2>
      <p className="text-muted-foreground">
        {t("admin.users.subtitle")}
      </p>
    </div>
    <UserTableWrapper />  
  </div>
  )
}
