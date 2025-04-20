import Banner from "@/components/shared/Banner";
import ContactUs from "../properties/components/contact-us";
import FAQ from "./components/faq";
import { useTranslations } from "next-intl";
import Header from "@/components/shared/Header";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Contact Us" : "تواصل معنا",
    description:
      locale === "en"
        ? "Contact us for any inquiries or to schedule a visit"
        : "تواصل معنا لأي أستفسارات أو ترتيب زيارة",
  };
};

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <>
      <Header />
      <Banner backgroundImage="/images/about.jpg" height="60vh">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl">{t("subtitle")}</p>
        </div>
      </Banner>

      <div className="container mx-auto py-16 px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ContactUs type="contact" />
          </div>
          <div className="lg:col-span-2">
            <FAQ />
          </div>
        </div>
      </div>
    </>
  );
}
