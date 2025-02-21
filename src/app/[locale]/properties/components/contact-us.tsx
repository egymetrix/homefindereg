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

const ContactUs = () => {
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        const formValue = key === "telephone" ? Number(value) : value;
        data.append(key, formValue.toString());
      });
      const response = await contactUs(data, locale);
      console.log(response);
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
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <Mail className="w-4 h-4 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {locale === "ar" ? "تواصل معنا" : "Contact Us"}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label={locale === "ar" ? "الاسم*" : "Name*"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            type="text"
            label={locale === "ar" ? "اللقب*" : "Surname*"}
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
        </div>

        <Input
          type="email"
          label={locale === "ar" ? "البريد الإلكتروني*" : "Email*"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          type="text"
          label={locale === "ar" ? "رقم الهاتف*" : "Telephone*"}
          value={formData.telephone}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {locale === "ar" ? "الرسالة*" : "Message*"}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full min-h-[120px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors duration-200"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
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
