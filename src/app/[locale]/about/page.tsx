import Header from "@/components/shared/Header";
import OurMission from "./components/OurMission";
import OurTeam from "./components/OurTeam";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About Dream Home Finder" : "عن Dream Home Finder",
    description:
      locale === "en"
        ? "Learn more about our real estate company, our mission, values and dedicated team helping you find your perfect home"
        : "تعرف على المزيد عن شركتنا العقارية ومهمتنا وقيمنا وفريقنا المتفاني لمساعدتك في العثور على منزلك المثالي",
  };
};

export default function About() {
  return (
    <>
      <Header />
      <OurMission />
      <OurTeam />
    </>
  );
}
