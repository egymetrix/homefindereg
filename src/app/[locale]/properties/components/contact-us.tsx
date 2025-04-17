/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocale } from "next-intl";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { contactUs } from "@/services/contact-us";

const ContactUs = ({ type }: { type?: string }) => {
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    message: "",
    type: type || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        const formValue = key === "telephone" ? Number(value) : value;
        data.append(key, formValue.toString());
      });
      const response = await contactUs(data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(
        (response as { message?: string })?.message ||
          (locale === "ar"
            ? "تم إرسال رسالتك بنجاح"
            : "Message sent successfully")
      );
      setFormData({
        name: "",
        surname: "",
        email: "",
        telephone: "",
        message: "",
        type: type || "property",
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
          (locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Error sending message")
      );
    },
  });

  const handleSubmit = () => {
    if (Object.values(formData).some((value) => !value)) {
      toast.error(
        locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill in all fields"
      );
      return;
    }
    mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center">
          <Mail className="w-3 h-3 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-gray-800">
          {locale === "ar" ? "تواصل معنا" : "Contact Us"}
        </h2>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            label={locale === "ar" ? "الاسم*" : "Name*"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-sm"
          />
          <Input
            type="text"
            label={locale === "ar" ? "اللقب*" : "Surname*"}
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
            className="text-sm"
          />
        </div>

        <Input
          type="email"
          label={locale === "ar" ? "البريد الإلكتروني*" : "Email*"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="text-sm"
        />

        <Input
          type="text"
          label={locale === "ar" ? "رقم الهاتف*" : "Telephone*"}
          value={formData.telephone}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
          className="text-sm"
        />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {locale === "ar" ? "الرسالة*" : "Message*"}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full min-h-[80px] p-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder={
              locale === "ar"
                ? "اكتب رسالتك هنا..."
                : "Write your message here..."
            }
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full text-sm py-3"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : locale === "ar" ? (
            "إرسال"
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactUs;
