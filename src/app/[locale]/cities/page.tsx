import CityHero from "@/app/[locale]/cities/components/city-hero";
import Description from "@/app/[locale]/cities/components/description";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Cities" : "المدن",
    description:
      locale === "en"
        ? "Browse through our list of cities and find your perfect home"
        : "استكشف قائمة المدن وابحث عن منزلك المثالي",
  };
};

const CitiesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      }
    >
      <Header />
      <CityHero />
      <Description />
      <Cities />
    </Suspense>
  );
};

export default CitiesPage;
