/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocale } from "next-intl";
import { Mail, Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
// import { clientPost } from "@/services/api";

const ContactUs = ({
  type,
  preporty_id,
}: {
  type?: string;
  preporty_id?: string;
}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    message: "",
    type: type || "",
    kind_request: "",
    preporty_id: preporty_id || "",
  });

  console.log("formData", formData);

  const [isOpen, setIsOpen] = useState(false);

  const kindRequestOptions = [
    {
      value: "property_evaluation",
      label: locale === "ar" ? "تقييم العقارات" : "Property Evaluation",
    },
    {
      value: "engineering_consultancy",
      label:
        locale === "ar"
          ? "خدمة الاستشارات الهندسية"
          : "Engineering Consultancy",
    },
    {
      value: "thermal_insulation",
      label:
        locale === "ar" ? "العزل الحراري للمنازل" : "Home Thermal Insulation",
    },
    {
      value: "other",
      label: locale === "ar" ? "أخرى" : "Other",
    },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty preporty_id and kind_request fields
        if ((key === "preporty_id" || key === "kind_request") && value === "") {
          return;
        }
        const formValue = key === "telephone" ? Number(value) : value;
        data.append(key, formValue.toString());
      });
      console.log("data", data);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/site/contactus-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        }
      );
      console.log("response", response);
      return response;
    },
    onSuccess: () => {
      toast.success(
        locale === "ar"
          ? "تم إرسال رسالتك! سنقوم بالرد عليك قريبًا."
          : "Your message has been sent! We'll get back to you soon."
      );
      setFormData({
        name: "",
        surname: "",
        email: "",
        telephone: "",
        message: "",
        type: type || "property",
        kind_request: "",
        preporty_id: preporty_id || "",
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
    // Check only required fields, not optional ones
    const requiredFields = ["name", "surname", "email", "telephone", "message"];

    // Add kind_request as required only on the contact page
    if (pathname.includes("contact")) {
      requiredFields.push("kind_request");
    }

    const missingRequiredField = requiredFields.some(
      (field) => !formData[field as keyof typeof formData]
    );

    console.log("missingRequiredField", missingRequiredField);

    if (missingRequiredField) {
      toast.error(
        locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill in all fields"
      );
      return;
    }

    mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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

        {pathname.includes("contact") && (
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {locale === "ar" ? "نوع الطلب*" : "Request Type*"}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <span className="text-sm">
                  {formData.kind_request
                    ? kindRequestOptions.find(
                      (opt) => opt.value === formData.kind_request
                    )?.label
                    : locale === "ar"
                      ? "اختر نوع الطلب"
                      : "Select request type"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <>
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg py-1 overflow-hidden">
                    {kindRequestOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${formData.kind_request === option.value
                            ? "text-primary font-medium bg-primary/5"
                            : "text-gray-700"
                          }`}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            kind_request: option.value,
                          });
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                  />
                </>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {locale === "ar" ? "الرسالة*" : "Message*"}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full min-h-[80px] p-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
