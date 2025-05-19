"use client";

import { getProperty } from "@/services/properties";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import PropertyHeader from "@/app/[locale]/properties/components/property-header";
import { Loader2 } from "lucide-react";
import ImageGallery from "@/app/[locale]/properties/components/image-gallery";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import Characteristics from "./characteristics";
import RequestAppointment from "./request-appointment";
import ContactUs from "./contact-us";
import Description from "./description";
import OtherFeatures from "./other-features";
import PropertyPlace from "./property-place";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import SuggestedProperties from "./suggested-properties";

const PropertyContainer = ({ propertyId }: { propertyId: string }) => {
  const locale = useLocale();
  const router = useRouter();
  const id = propertyId.split("-")[1];
  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  });


  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/");
    }
  }, [data, isLoading, router]);

  // Create breadcrumb items
  const breadcrumbItems = [
    {
      label: locale === "en" ? "Home" : "الرئيسية",
      href: "/",
    },
    {
      label: locale === "en" ? "Properties" : "العقارات",
      href: "",
      onClick: () => {
        router.back();
      },
    },
    {
      label:
        data?.data?.home_name ||
        (locale === "en" ? "Property Details" : "تفاصيل العقار"),
      href: `#`,
    },
  ];

  return (
    <div className="mx-auto min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          <PropertyHeader property={data?.data ?? undefined} />
          <div className="max-w-screen-xl mx-auto py-3">
            <div className="px-4 sm:px-6 lg:px-8">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <ImageGallery data={data?.data ?? undefined} />
            <main className="max-w-7xl mx-auto">
              <section className="w-full flex flex-col md:flex-row gap-6 bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-xl">
                <div className="flex flex-col gap-4 basis-2/3">
                  <Characteristics property={data?.data ?? undefined} />
                  <Description property={data?.data ?? undefined} />
                  <OtherFeatures property={data?.data ?? undefined} />
                  <PropertyPlace property={data?.data ?? undefined} />
                </div>
                <div className="basis-1/3">
                  <div className="mb-4">
                    <RequestAppointment property={data?.data ?? undefined} />
                  </div>
                  <div className="sticky top-48">
                    <ContactUs type="property" preporty_id={id} />
                  </div>
                </div>
              </section>

              {data?.HomeSuggest && data.HomeSuggest.length > 0 && (
                <div className="px-4 sm:px-6 lg:px-8">
                  <SuggestedProperties properties={data.HomeSuggest} />
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyContainer;
