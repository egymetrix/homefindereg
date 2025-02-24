"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronDown, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";

const LanguageSwitcher = ({ bgColor = false }: { bgColor?: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale();

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  // Create the full URL with search params
  const getFullPath = (path: string) => {
    // Ensure path starts with a forward slash
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const params = searchParams.toString();
    return params ? `${normalizedPath}?${params}` : normalizedPath;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center z-[99999] gap-1.5 text-sm hover:opacity-75 transition-colors duration-200 ${
          bgColor ? "text-gray-900" : "text-white"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{currentLocale}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute mt-2 right-0 bg-white z-[99999] rounded-md shadow-lg py-1 min-w-[100px] border border-gray-100">
            {languages.map((language) => (
              <Link
                key={language.code}
                href={getFullPath(pathname)}
                scroll={false}
                locale={language.code}
                className={`flex items-center px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                  currentLocale === language.code
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {language.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
