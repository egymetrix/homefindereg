import Header from "@/components/shared/Header";
import Filters from "@/app/[locale]/cities/[cityId]/components/filters";
import Main from "@/app/[locale]/cities/[cityId]/components/main";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function CityPage() {
  return (
    <>
      <Header withBg />
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <Filters />
      </Suspense>
      <div className="min-h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <Main />
        </Suspense>
      </div>
    </>
  );
}
