import "leaflet/dist/leaflet.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "./globals.css";
import { Nunito, Cairo } from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/shared/Footer";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Property Guidance You Can Trust | Dream Home Finder"
        : "معك خطوة بخطوة في رحلتك العقارية | دريم هوم فايندر",
    description:
      locale === "en"
        ? "Dream Home Finder is your trusted partner in real estate. We offer expert guidance and a curated selection of properties to help you find your perfect home. Browse listings, connect with agents, and make informed decisions with our comprehensive property search platform."
        : "دريم هوم فايندر شريكك الموثوق في مجال العقارات. نقدم التوجيه الخبير ومجموعة مختارة من العقارات لمساعدتك في العثور على منزل أحلامك. تصفح القوائم وتواصل مع الوكلاء واتخذ قرارات مدروسة من خلال منصتنا الشاملة للبحث عن العقارات.",
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  if (!routing.locales.includes(locale as "en")) {
    notFound();
  }

  return (
    <html
      suppressHydrationWarning
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      <body
        className={`${
          locale === "ar" ? cairo.className : nunito.className
        } antialiased`}
      >
        <ReactQueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <Toaster
                containerStyle={{
                  zIndex: 99999999,
                }}
                toastOptions={{
                  style: {
                    zIndex: 99999999,
                  },
                  className: "z-[99999999]",
                }}
                position={locale === "ar" ? "top-right" : "top-left"}
              />
              {children}
              <Footer />
            </AuthProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
