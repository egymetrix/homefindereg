import Banner from "@/components/shared/Banner";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("About");

  return (
    <Banner backgroundImage="/images/about.jpg" height="70vh">
      <div className="container relative flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
        </div>
      </div>
    </Banner>
  );
}
