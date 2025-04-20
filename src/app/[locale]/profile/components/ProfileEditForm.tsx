"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";
import { clientPost } from "@/services/api";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProfileEditFormProps {
  user: User;
  onCancel: () => void;
}

const ProfileEditForm = ({ user, onCancel }: ProfileEditFormProps) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = useLocale();
  const t = useTranslations("profile");
  const { checkAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match if provided
    if (password && password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (phone) {
      formData.append("phone", phone);
    }

    if (password) {
      formData.append("password", password);
      formData.append("confirm_password", confirmPassword);
    }

    try {
      setIsSubmitting(true);
      const response = await clientPost("/site/update-profile", formData);

      if (response) {
        toast.success(t("profileUpdated"));
        // Refresh user data
        await checkAuth();
        onCancel();
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
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 max-w-md mx-auto text-left"
    >
      <div>
        <Input
          type="text"
          label={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="tel"
          label={t("phone")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          label={t("newPassword")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute top-1/2 -translate-y-1/2 ${
            showPassword ? "text-primary" : "text-gray-500"
          } ${locale === "en" ? "right-3" : "left-3"}`}
        >
          {showPassword ? (
            <Eye className="w-5 h-5 text-gray-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          label={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!password}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className={`absolute top-1/2 -translate-y-1/2 ${
            showConfirmPassword ? "text-primary" : "text-gray-500"
          } ${locale === "en" ? "right-3" : "left-3"}`}
          disabled={!password}
        >
          {showConfirmPassword ? (
            <Eye className="w-5 h-5 text-gray-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("updating")}
            </>
          ) : (
            t("update")
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
