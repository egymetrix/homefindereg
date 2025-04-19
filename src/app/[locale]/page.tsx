import Hero from "@/app/[locale]/components/Hero";
import Services from "@/app/[locale]/components/Services";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";
import OurTeam from "./about/components/OurTeam";
import HomeFAQ from "./components/HomeFAQ";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Cities />
      <OurTeam />
      <HomeFAQ />
    </>
  );
};

export default Home;
