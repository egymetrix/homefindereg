"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPropertyEvaluation,
  getEngineeringConsultant,
  getThermalInsulation,
} from "@/services/properties";
import Banner from "@/components/shared/Banner";
import ContactUs from "../../properties/components/contact-us";
import TransitionBox from "@/components/shared/TransitionBox";
import { useRouter } from "@/i18n/routing";
import Header from "@/components/shared/Header";

interface ServiceData {
  id: number;
  title: string;
  content: string;
  long_content: string;
  media: { original_url: string }[];
}

interface ServiceResponse {
  success: boolean;
  status: number;
  message: string;
  data: ServiceData;
}

const ServiceDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        let response: ServiceResponse | undefined;

        // Validate service name
        const validServices = [
          "property-evaluation",
          "thermal-insulation",
          "engineering-consultant",
        ];
        if (!validServices.includes(id)) {
          // Invalid service name, mark fetch as attempted but set no service
          setFetchAttempted(true);
          setLoading(false);
          return;
        }

        if (id === "property-evaluation") {
          response = (await getPropertyEvaluation()) as ServiceResponse;
        } else if (id === "thermal-insulation") {
          response = (await getThermalInsulation()) as ServiceResponse;
        } else if (id === "engineering-consultant") {
          response = (await getEngineeringConsultant()) as ServiceResponse;
        }

        if (response && response.data) {
          setService(response.data);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setFetchAttempted(true);
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  // Redirect to home only after we've attempted to fetch and confirmed no service exists
  useEffect(() => {
    if (fetchAttempted && !loading && !service) {
      router.push("/");
    }
  }, [fetchAttempted, loading, service, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Service should exist at this point, but add a safety check
  if (!service) return null;

  // Render HTML content from the service
  const formattedContent =
    service.long_content?.replace(/\\r\\n/g, "<br>") || "";

  return (
    <>
      <Header />
      <Banner
        backgroundImage={
          service.media?.[0]?.original_url || "/images/hero-bg.jpg"
        }
        height="60vh"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            {service.content}
          </p>
        </div>
      </Banner>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-3">
            <TransitionBox
              containerClassName="lg:w-[70%]"
              transitionType="fromLeft"
              delay={0.2}
            >
              <div className="p-8 md:p-10">
                <div
                  className="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </div>
            </TransitionBox>

            <TransitionBox
              containerClassName="lg:w-[30%]"
              transitionType="fromRight"
              delay={0.4}
            >
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <ContactUs type="service" />
              </div>
            </TransitionBox>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
