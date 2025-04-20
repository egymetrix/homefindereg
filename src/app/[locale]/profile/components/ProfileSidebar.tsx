"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { HomeIcon, UserIcon, LockIcon, LogOutIcon } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function ProfileSidebar() {
  const t = useTranslations("profile");
  const pathname = usePathname();
  const { locale } = useParams();
  const { user, logout } = useAuthContext();

  const navItems: NavItem[] = [
    {
      icon: <HomeIcon className="w-5 h-5" />,
      label: t("dashboard"),
      href: `/${locale}/profile`,
    },
    {
      icon: <UserIcon className="w-5 h-5" />,
      label: t("accountDetails"),
      href: `/${locale}/profile/account`,
    },
    {
      icon: <LockIcon className="w-5 h-5" />,
      label: t("changePassword"),
      href: `/${locale}/profile/password`,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden w-full max-w-xs">
      <div className="p-4 flex flex-col items-center border-b border-gray-100">
        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        <h3 className="font-medium text-lg">{user?.name}</h3>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-gray-50",
                  pathname === item.href &&
                    "bg-gray-50 text-primary font-medium"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}

          <li className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-gray-50 w-full text-left text-red-500"
            >
              <LogOutIcon className="w-5 h-5" />
              {t("logout")}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
