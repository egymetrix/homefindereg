"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { redirect, useParams } from "next/navigation";
import ProfileLayout from "./components/ProfileLayout";
import ProfileLoading from "./components/ProfileLoading";
import { useTranslations } from "next-intl";
import { UserIcon, BuildingIcon } from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const t = useTranslations("profile");
  const { locale } = useParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("dashboard")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="p-3 rounded-full bg-primary/10 self-start mb-3">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">{t("accountDetails")}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {t("manageAccountDetails")}
            </p>
            <Link
              href={`/${locale}/profile/account`}
              className="mt-auto text-primary font-medium hover:underline"
            >
              {t("manageAccount")}
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="p-3 rounded-full bg-primary/10 self-start mb-3">
              <BuildingIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">{t("savedProperties")}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {t("viewSavedProperties")}
            </p>
            <Link
              href={`/${locale}/profile/favorites`}
              className="mt-auto text-primary font-medium hover:underline"
            >
              {t("viewSaved")}
            </Link>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;
