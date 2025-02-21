import Header from "@/components/shared/Header";
import MainSearchPage from "./components/main-search-page";
import Filters from "../../cities/[cityId]/components/filters";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const SearchPage = () => {
  return (
    <>
      <Header withBg withShadow />
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <Filters />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <MainSearchPage />
      </Suspense>
    </>
  );
};

export default SearchPage;
