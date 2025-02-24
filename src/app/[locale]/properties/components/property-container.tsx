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

const PropertyContainer = ({ propertyId }: { propertyId: string }) => {
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getProperty(propertyId, locale),
  });

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/");
    }
  }, [data, isLoading, router]);

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
            <ImageGallery data={data?.data ?? undefined} />
            <main className="max-w-7xl mx-auto">
              <section className="w-full flex flex-col md:flex-row gap-6 bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-xl">
                <div className="flex flex-col gap-4 basis-2/3">
                  <Characteristics property={data?.data ?? undefined} />
                  <Description property={data?.data ?? undefined} />
                  <OtherFeatures property={data?.data ?? undefined} />
                  <PropertyPlace property={data?.data ?? undefined} />
                </div>
                <div className="flex flex-col gap-4 basis-1/3">
                  <RequestAppointment />
                  <ContactUs />
                </div>
              </section>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyContainer;
