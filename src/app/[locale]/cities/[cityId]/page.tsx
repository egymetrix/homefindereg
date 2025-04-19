import Header from "@/components/shared/Header";
import Filters from "@/app/[locale]/cities/[cityId]/components/filters";
import Main from "@/app/[locale]/cities/[cityId]/components/main";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Cities" : "المدن",
    description:
      locale === "en"
        ? "Browse through our list of cities and find your perfect home"
        : "استكشف قائمة المدن وابحث عن منزلك المثالي",
  };
};

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
