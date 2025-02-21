import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function NotFoundPage() {
  const locale = useLocale();
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="mt-4 text-gray-500">
          {locale === "ar"
            ? "لا يمكننا العثور على هذه الصفحة"
            : "We can&apos;t find that page."}
        </p>

        <Link
          href={"/"}
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-3 focus:outline-hidden"
        >
          {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Go Back Home"}
        </Link>
      </div>
    </div>
  );
}
