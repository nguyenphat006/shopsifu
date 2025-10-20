import {
  LayoutDashboardIcon,
  BellDot,
  User,
  NotepadText,
  ShieldCheck,
  BookMarked,
} from "lucide-react";

export const sidebarItems = [
  {
    labelKey: "user.account.profile.dashboard",
    href: "/user/dashboard",
    icon: <LayoutDashboardIcon className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    labelKey: "user.account.myPurchase.myPurchase",
    href: "/user/orders",
    icon: <NotepadText className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    labelKey: "user.account.profile.profile",
    href: "/user/profile",
    icon: <User className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    labelKey: "user.account.profile.policy",
    href: "/policy",
    icon: <BookMarked className="w-5 h-5" strokeWidth={2.5} />,
    target: "_blank",
    rel: "noopener noreferrer",
  },
  // {
  //   labelKey: "user.settings.section.notifications",
  //   href: "/user/notifications",
  //   icon: <BellDot className="w-5 h-5" strokeWidth={2.5} />,
  // },
  // {
  //   labelKey: "user.account.security.security",
  //   href: "/user/security",
  //   icon: <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />,
  // },
];
