"use client";

import { useRef, useEffect, useState } from "react";
import TransitionBox from "@/components/shared/TransitionBox";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import {
  getPropertyEvaluation,
  getEngineeringConsultant,
  getThermalInsulation,
} from "@/services/properties";
import Link from "next/link";

interface ServiceData {
  id: number;
  title: string;
  content: string;
  media: { original_url: string }[];
}

interface ServiceResponse {
  success: boolean;
  status: number;
  message: string;
  data: ServiceData;
}

// Interface with the navigation name property
interface EnhancedServiceData extends ServiceData {
  name: string;
}

interface ServiceCardProps {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
  delay?: number;
}

const ServiceCard = ({
  name,
  title,
  description,
  imageSrc,
  delay = 0,
}: ServiceCardProps) => {
  const t = useTranslations("home.services");

  return (
    <TransitionBox
      transitionType="fromBottom"
      delay={delay}
      containerClassName="flex flex-col items-center justify-between h-full rounded-lg p-6 max-w-sm mx-auto w-full transform scale-100 transition-all duration-300 ease-in-out hover:scale-105"
    >
      <div className="flex flex-col items-center w-full">
        <div className="relative w-64 h-64 md:w-72 md:h-72 mb-6 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center flex-grow w-full">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3 text-center">
            {title}
          </h3>
          <p className="text-gray-600 text-center mb-6 flex-grow">
            {description}
          </p>
        </div>
      </div>
      <div className="text-center">
        <Link href={`/services/${name}`}>
          <Button>{t("findOutMore")}</Button>
        </Link>
      </div>
    </TransitionBox>
  );
};

const Services = () => {
  const t = useTranslations("home.services");
  const ref = useRef(null);
  const [services, setServices] = useState<EnhancedServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [
          propertyEvaluationRes,
          engineeringConsultantRes,
          thermalInsulationRes,
        ] = await Promise.all([
          getPropertyEvaluation() as Promise<ServiceResponse>,
          getEngineeringConsultant() as Promise<ServiceResponse>,
          getThermalInsulation() as Promise<ServiceResponse>,
        ]);

        // Create enhanced service objects with explicit navigationIds
        const enhancedServices: EnhancedServiceData[] = [
          {
            ...propertyEvaluationRes.data,
            name: "property-evaluation",
          },
          {
            ...engineeringConsultantRes.data,
            name: "engineering-consultant",
          },
          {
            ...thermalInsulationRes.data,
            name: "thermal-insulation",
          },
        ];

        setServices(enhancedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50" ref={ref} id="services">
      <TransitionBox
        transitionType="fromBottom"
        className="container mx-auto"
        delay={0.2}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 md:mb-16">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : (
            services.map((service, index) => {
              // Debug log for each service before rendering
              return (
                <ServiceCard
                  key={index}
                  name={service.name}
                  title={service.title}
                  description={service.content}
                  imageSrc={
                    service.media?.[0]?.original_url ||
                    "/images/placeholder.jpg"
                  }
                  delay={0.2 * (index + 1)}
                />
              );
            })
          )}
        </div>
      </TransitionBox>
    </section>
  );
};

export default Services;
