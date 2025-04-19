"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import { useLocale } from "next-intl";
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function OurTeam() {
  const t = useTranslations("About");
  const locale = useLocale();

  const team = [
    {
      image: "/team/Alberto.jpeg",
      nameEn: "Alberto Castagneri",
      nameAr: "ألبرتو كاستاجنيري",
      positionEn: "Chief Technical Officer",
      positionAr: "المدير الفني التنفيذي",
    },
    {
      image: "/team/Aya.jpeg",
      nameEn: "Aya Mahrous",
      nameAr: "آية محروس",
      positionEn: "Marketing Specialist",
      positionAr: "مسؤولة التسويق",
    },
    {
      image: "/team/Marilena.jpeg",
      nameEn: "Marilena Miresse",
      nameAr: "ماريلينا ميريس",
      positionEn: "Operations Manager",
      positionAr: "مدير العمليات",
    },
    {
      image: "/team/Mohamed.jpeg",
      nameEn: "Mohamed Kelany",
      nameAr: "محمد الكيلاني",
      positionEn: "Sales Manager",
      positionAr: "مدير المبيعات",
    },
    {
      image: "/team/Mostafa.jpeg",
      nameEn: "Mostafa Gad",
      nameAr: "مصطفى جاد",
      positionEn: "Business Relations Officer",
      positionAr: "مسؤول علاقات الأعمال",
    },
  ];

  // Navigation custom button refs
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-16 lg:py-24 bg-gray-100">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("team.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t("team.description")}
          </p>
        </div>

        <div className="relative mx-auto max-w-screen-xl">
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            loop={true}
            spaceBetween={24}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            onInit={(swiper) => {
              // @ts-expect-error - Swiper's type definitions are incomplete
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-expect-error - Swiper's type definitions are incomplete
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="px-12"
          >
            {team.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={locale === "en" ? member.nameEn : member.nameAr}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {locale === "en" ? member.nameEn : member.nameAr}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {locale === "en" ? member.positionEn : member.positionAr}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          position: relative;
          margin-top: 30px;
        }

        .swiper-slide-active {
          z-index: 10;
        }

        .swiper-slide {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .swiper-pagination-bullet {
          width: 30px;
          height: 4px;
          background: #e2e8f0;
          opacity: 1;
          border-radius: 2px;
          transition: all 0.4s ease;
        }

        .swiper-pagination-bullet-active {
          width: 40px;
          background: #3b82f6;
        }

        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          background-image: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0)
          ) !important;
        }
      `}</style>
    </section>
  );
}
