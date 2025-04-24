import Hero from "@/app/[locale]/components/Hero";
import Services from "@/app/[locale]/components/Services";
import Cities from "@/app/[locale]/components/Cities";
import Header from "@/components/shared/Header";
import OurTeam from "./about/components/OurTeam";
import HomeFAQ from "./components/HomeFAQ";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const Home = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <Header />
        <Hero />
        <Services />
        <Cities />
        <OurTeam />
        <HomeFAQ />
      </Suspense>
    </>
  );
};

export default Home;
