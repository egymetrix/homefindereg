"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { clientPost } from "@/services/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("profile");
  const { checkAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (phone) {
      formData.append("phone", phone);
    }

    try {
      setIsSubmitting(true);
      const response = await clientPost("/site/update-profile", formData);

      if (response) {
        toast.success(t("profileUpdated"));
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
      <h2 className="text-2xl font-semibold mb-6">{t("accountSettings")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("emailAddress")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="support@profilepress.net"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("name")}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("phone")}
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full"
            />
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
              t("saveChanges")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
