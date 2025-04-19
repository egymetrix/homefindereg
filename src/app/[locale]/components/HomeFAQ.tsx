"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFAQ } from "@/services/properties";
import Image from "next/image";
import { Link } from "@/i18n/routing";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQResponse = {
  data: {
    data: FAQItem[];
  };
};

const HomeFAQ = () => {
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: faqData } = useQuery<FAQResponse>({
    queryKey: ["faq"],
    queryFn: () => getFAQ() as Promise<FAQResponse>,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const limitedFAQs = faqData?.data?.data?.slice(0, 5) || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === "ar"
              ? "اطلع على إجابات الأسئلة الأكثر شيوعًا حول خدماتنا وعملياتنا"
              : "Browse through answers to the most common questions about our services and operations"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* FAQ Section */}
          <div className="space-y-4">
            {limitedFAQs.length > 0 ? (
              <>
                {limitedFAQs.map((faq: FAQItem, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-medium text-gray-800">
                        {faq.question}
                      </span>
                      {openIndex === index ? (
                        <ChevronUp className="w-4 h-4 text-primary transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-primary transition-transform duration-300" />
                      )}
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-4 pt-0 bg-white">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 text-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    {locale === "ar"
                      ? "عرض المزيد من الأسئلة"
                      : "View more questions"}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/images/mobile_2.jpg"
              alt={locale === "ar" ? "صورة الأسئلة الشائعة" : "FAQ Image"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {locale === "ar"
                  ? "هل لديك المزيد من الأسئلة؟"
                  : "Have more questions?"}
              </h3>
              <p className="text-white/90 mb-6">
                {locale === "ar"
                  ? "نحن هنا للمساعدة. تواصل معنا للحصول على المزيد من المعلومات."
                  : "We're here to help. Contact us for more information."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors w-fit"
              >
                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
