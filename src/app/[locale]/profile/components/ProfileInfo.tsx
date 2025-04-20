"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import ProfileEditForm from "./ProfileEditForm";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { PencilLine } from "lucide-react";

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("profile");

  if (isEditing) {
    return <ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="mt-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("personalInfo")}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <PencilLine className="w-4 h-4 mr-1" />
            {t("edit")}
          </Button>
        </div>

        <div className="space-y-3 text-left">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("name")}</span>
            <span className="text-lg font-medium">{user.name}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("email")}</span>
            <span className="text-lg font-medium">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{t("phone")}</span>
              <span className="text-lg font-medium">{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
