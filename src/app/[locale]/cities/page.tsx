import CityHero from "@/app/[locale]/cities/components/city-hero";
import Description from "@/app/[locale]/cities/components/description";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";

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
