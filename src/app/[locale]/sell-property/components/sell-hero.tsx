import Banner from "@/components/shared/Banner";
import { useTranslations } from "next-intl";

const SellHero = () => {
  const t = useTranslations("sell-hero");
  return (
    <Banner backgroundImage="/images/hero-sell-estate.jpg" height="70vh">
      <div className="flex flex-col items-start justify-center text-white max-w-4xl ml-4 md:ml-10">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold">{t("title")}</h1>
        <p className="text-lg md:text-xl lg:text-2xl mt-2">{t("description")}</p>
      </div>
    </Banner>
  );
};

export default SellHero;
