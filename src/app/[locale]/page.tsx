import Hero from "@/app/[locale]/components/Hero";
import Services from "@/app/[locale]/components/Services";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Cities />
    </>
  );
};

export default Home;
