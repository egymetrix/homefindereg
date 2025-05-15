/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Banner from "@/components/shared/Banner";
import { getPrivacyPolicy } from "@/services/properties";
import { useQuery } from "@tanstack/react-query";
import PrivacyContent from "./privacy-content";

interface ServiceResponse {
  data?: any;
  success?: boolean;
  status?: number;
  message?: string;
}

const PrivacyHero = () => {
  const { data: serviceData } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: () => getPrivacyPolicy() as Promise<ServiceResponse>,
  })

  const title = serviceData?.data?.title || "Privacy Policy";
  const content = serviceData?.data?.content || "Learn about how we handle your personal information";
  const bannerImage = serviceData?.data?.media?.[0]?.original_url || "/images/hero-bg.jpg";
  return (
    <div className="min-h-screen">
      <Banner
        backgroundImage={bannerImage}
        height="60vh"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            {content}
          </p>
        </div>
      </Banner>
      <PrivacyContent service={serviceData?.data} />
    </div>
  );
};

export default PrivacyHero;
