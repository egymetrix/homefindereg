"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import { useLocale } from "next-intl";
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
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
      image:
        "/team/Alberto Castagneri - Chief Technical Officer ألبرتو كاستاجنيري – المدير الفني التنفيذي.jpeg",
      nameEn: "Alberto Castagneri",
      nameAr: "ألبرتو كاستاجنيري",
      positionEn: "Chief Technical Officer",
      positionAr: "المدير الفني التنفيذي",
    },
    {
      image:
        "/team/Aya Mahrous - Marketing Specialist آية محروس – مسؤولة التسويق.jpeg",
      nameEn: "Aya Mahrous",
      nameAr: "آية محروس",
      positionEn: "Marketing Specialist",
      positionAr: "مسؤولة التسويق",
    },
    {
      image:
        "/team/Marilena Miresse - Operations Manager ماريلينا ميريس - مدير العمليات.jpeg",
      nameEn: "Marilena Miresse",
      nameAr: "ماريلينا ميريس",
      positionEn: "Operations Manager",
      positionAr: "مدير العمليات",
    },
    {
      image:
        "/team/Mohamed Kelany - Sales Manager محمد الكيلاني – مدير المبيعات.jpeg",
      nameEn: "Mohamed Kelany",
      nameAr: "محمد الكيلاني",
      positionEn: "Sales Manager",
      positionAr: "مدير المبيعات",
    },
    {
      image:
        "/team/Mostafa Gad - Business Relations Officer مصطفى جاد – مسؤول علاقات الأعمال.jpeg",
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
    <section className="py-16 lg:py-24">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("team.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t("team.description")}
          </p>
        </div>

        <div className="relative mx-auto px-16 md:px-20 py-10">
          {/* Custom navigation buttons remain the same */}

          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
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
            className="team-swiper py-10 !overflow-visible"
          >
            {team.map((member, index) => (
              <SwiperSlide key={index} className="!px-2 !py-4">
                {({ isActive }) => (
                  <div
                    className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl ${
                      isActive
                        ? "ring-2 ring-blue-500 ring-offset-2 scale-105 z-10"
                        : "opacity-75 scale-90"
                    }`}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={member.image}
                        alt={locale === "en" ? member.nameEn : member.nameAr}
                        width={400}
                        height={533}
                        className={`h-full w-full object-contain transition-transform duration-500 ${
                          isActive ? "scale-105" : "group-hover:scale-105"
                        }`}
                        priority={index === 0}
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {locale === "en" ? member.nameEn : member.nameAr}
                      </h3>
                      <p className="text-sm font-medium text-blue-600">
                        {locale === "en"
                          ? member.positionEn
                          : member.positionAr}
                      </p>
                    </div>
                  </div>
                )}
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
