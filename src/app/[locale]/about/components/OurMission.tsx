/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useQuery } from "@tanstack/react-query";
import PrivacyContent from "../../privacy-policy/components/privacy-content";
import { getAboutUs } from "@/services/properties";
import Banner from "@/components/shared/Banner";

interface ServiceResponse {
  data?: any;
  success?: boolean;
  status?: number;
  message?: string;
}

export default function OurMission() {
  const { data: serviceData } = useQuery({
    queryKey: ["about-us"],
    queryFn: () => getAboutUs() as Promise<ServiceResponse>,
  })

  const title = serviceData?.data?.title || "Our Mission";
  const description = serviceData?.data?.content || "Our mission is to help you find your perfect home";
  const bannerImage = serviceData?.data?.media?.[0]?.original_url || "/images/about.jpg";

  return (
    <>
      <Banner backgroundImage={bannerImage} height="70vh">
        <div className="container relative flex h-full items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </Banner>
      <section className="py-16 lg:py-24 max-w-screen-xl mx-auto">
        <PrivacyContent service={serviceData?.data} />
      </section>
    </>
  );
}
