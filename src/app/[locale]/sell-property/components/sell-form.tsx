"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clientPost } from "@/services/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader2, FileText, CheckCircle, BarChart2 } from "lucide-react";

interface FormData {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  preporty_address: string;
  files: File[];
}

const SellForm = () => {
  const locale = useLocale();
  const t = useTranslations("sell-form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    preporty_address: "",
    files: [],
  });
  const [isPending, setIsPending] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...filesArray],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...filesArray],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("surname", formData.surname);
      submitFormData.append("email", formData.email);
      submitFormData.append("telephone", formData.telephone);
      submitFormData.append("preporty_address", formData.preporty_address);

      formData.files.forEach((file) => {
        submitFormData.append("files[]", file);
      });

      await clientPost("/site/store-sell-property", submitFormData);

      toast.success(t("successMessage"));
      setFormData({
        name: "",
        surname: "",
        email: "",
        telephone: "",
        preporty_address: "",
        files: [],
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t("errorMessage");
      toast.error(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Text with icons */}
          <div className="bg-primary text-white p-8 md:w-2/5">
            <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>
            <p className="text-lg mb-10">{t("subtitle")}</p>

            <div className="space-y-8">
              <div className="flex items-start">
                <FileText className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-xl mb-2">{t("formTitle")}</h3>
                  <p>{t("formDescription")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-xl mb-2">
                    {t("expertiseTitle")}
                  </h3>
                  <p>{t("expertiseDescription")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <BarChart2 className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-xl mb-2">
                    {t("marketTitle")}
                  </h3>
                  <p>{t("marketDescription")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="p-8 md:w-3/5">
            <h2 className="text-2xl font-semibold mb-6">
              {t("contactFormTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t("name")}
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                label={t("surname")}
                type="text"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
              />

              <Input
                label={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <Input
                label={t("telephone")}
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
              />

              <div className="md:col-span-2">
                <Input
                  label={locale === "ar" ? "العنوان" : "Address"}
                  type="text"
                  value={formData.preporty_address}
                  onChange={(e) =>
                    setFormData({ ...formData, preporty_address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* File upload section */}
            <div className="mt-6">
              <p className="text-sm text-gray-700 mb-2">{t("uploadFiles")}</p>
              <div
                className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileText className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-600">{t("dragAndDrop")}</p>
                  <p className="text-sm text-gray-500">
                    {t("orClickToUpload")}
                  </p>
                </div>
              </div>

              {/* File list */}
              {formData.files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t("uploadedFiles")}
                  </p>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm truncate max-w-xs">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-8"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellForm;
