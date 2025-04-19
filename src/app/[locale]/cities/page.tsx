import CityHero from "@/app/[locale]/cities/components/city-hero";
import Description from "@/app/[locale]/cities/components/description";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";

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
    <>
      <Header />
      <CityHero />
      <Description />
      <Cities />
    </>
  );
};

export default CitiesPage;
