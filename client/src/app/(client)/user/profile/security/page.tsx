"use client";
import { PasswordSecuritySession } from '@/components/client/user/account/desktop/security/security-Session';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const  t  = useTranslations();
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('user.account.security.title')}</h2>
        {/* <p className="text-muted-foreground">
          {t('user.account.security.subtitle')}
        </p> */}
      </div>
      <PasswordSecuritySession />
    </div>
  );
}