import Header from "@/components/shared/Header";
import SellHero from "./components/sell-hero";
import SellForm from "./components/sell-form";

const SellProperty = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <SellHero />
        <SellForm />
      </div>
    </>
  );
};

export default SellProperty;
