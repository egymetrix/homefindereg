import Header from "@/components/shared/Header";
import PrivacyHero from "./components/privacy-hero";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Privacy Policy" : "سياسة الخصوصية",
    description:
      locale === "en"
        ? "Learn more about our real estate company, our mission, values and dedicated team helping you find your perfect home and how we handle your personal information"
        : "تعرف على المزيد عن شركتنا العقارية ومهمتنا وقيمنا وفريقنا المتفاني لمساعدتك في العثور على منزلك المثالي وكيفية تعاملنا مع المعلومات الشخصية",
  };
};

export default async function ServicePage() {
  return (
    <>
      <Header />
      <PrivacyHero />
    </>
  );
}
