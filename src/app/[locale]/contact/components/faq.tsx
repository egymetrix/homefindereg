"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFAQ } from "@/services/properties";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQResponse = {
  data: {
    data: FAQItem[];
  };
};

const FAQ = () => {
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: faqData } = useQuery<FAQResponse>({
    queryKey: ["faq"],
    queryFn: () => getFAQ() as Promise<FAQResponse>,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <h2 className="text-base font-semibold text-gray-800">
          {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {Array.isArray(faqData?.data?.data) &&
          faqData?.data?.data?.map((faq: FAQItem, index: number) => (
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
      </div>
    </div>
  );
};

export default FAQ;
