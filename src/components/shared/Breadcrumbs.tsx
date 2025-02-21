import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <nav className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <ol
        className={`flex items-center gap-1 text-sm ${
          isRTL ? "flex-row" : "flex-row"
        }`}
      >
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className={`w-3.5 h-3.5 mx-1.5 text-gray-400 flex-shrink-0 ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            )}
            <Link
              href={item.href}
              className={`whitespace-nowrap hover:text-blue-600 transition-colors duration-200 ${
                index === items.length - 1
                  ? "text-gray-700 font-medium"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
