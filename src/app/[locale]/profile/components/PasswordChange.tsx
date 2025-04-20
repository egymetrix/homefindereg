"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";
import { clientPost } from "@/services/api";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = useLocale();
  const t = useTranslations("profile");
  const { checkAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);
    formData.append("new_password_confirmation", confirmPassword);

    try {
      setIsSubmitting(true);
      const response = await clientPost("/site/change-password", formData);

      if (response) {
        toast.success(t("passwordUpdated"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Refresh user data
        await checkAuth();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t("updateError");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">{t("changePassword")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <label className="text-sm font-medium mb-1 block">
              {t("currentPassword")}
            </label>
            <Input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder={t("currentPassword")}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className={`absolute top-[60%] -translate-y-1/2 ${
                showCurrentPassword ? "text-primary" : "text-gray-500"
              } ${locale === "en" ? "right-3" : "left-3"}`}
            >
              {showCurrentPassword ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-1 block">
              {t("newPassword")}
            </label>
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder={t("newPassword")}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className={`absolute top-[60%] -translate-y-1/2 ${
                showNewPassword ? "text-primary" : "text-gray-500"
              } ${locale === "en" ? "right-3" : "left-3"}`}
            >
              {showNewPassword ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-1 block">
              {t("confirmNewPassword")}
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("confirmNewPassword")}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute top-[60%] -translate-y-1/2 ${
                showConfirmPassword ? "text-primary" : "text-gray-500"
              } ${locale === "en" ? "right-3" : "left-3"}`}
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t("updating")}
              </>
            ) : (
              t("updatePassword")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
