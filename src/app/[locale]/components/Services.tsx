"use client";

import { useRef } from "react";
import TransitionBox from "@/components/shared/TransitionBox";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  delay?: number;
}

const ServiceCard = ({
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
        <Button>{t("findOutMore")}</Button>
      </div>
    </TransitionBox>
  );
};

const Services = () => {
  const t = useTranslations("home.services");
  const ref = useRef(null);

  const services = [
    {
      title: "Visit in comfort",
      description:
        "You can make an initial visit of the property from the comfort of your own home!",
      imageSrc: "/images/service.jpg",
      delay: 0.2,
    },
    {
      title: "Real estate valuation",
      description:
        "For free today you can have an evaluation of your property without wasting precious time.",
      imageSrc: "/images/service.jpg",
      delay: 0.4,
    },
    {
      title: "Work with us!",
      description: "Would you like to work in a real estate agency?",
      imageSrc: "/images/service.jpg",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50" ref={ref}>
      <TransitionBox
        transitionType="fromBottom"
        className="container mx-auto"
        delay={0.2}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 md:mb-16">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </TransitionBox>
    </section>
  );
};

export default Services;
