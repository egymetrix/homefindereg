import { Property } from "@/types";
import { useLocale } from "next-intl";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScrollText } from "lucide-react";

const Characteristics = ({ property }: { property: Property | undefined }) => {
  const [showAll, setShowAll] = useState(false);
  const locale = useLocale();
  if (!property) return null;

  const enCharacteristics = [
    { label: "REF:", value: property?.id || "" },
    { label: "Floor:", value: property?.["home-floor"] || "" },
    { label: "Box:", value: property?.["home-box"] || "" },
    { label: "Parking spaces:", value: property?.["home-parking"] || "" },
    { label: "Balconies:", value: property?.["home-balconies"] || "" },
    { label: "Bedrooms:", value: property?.["home-bedrooms"] || "" },
    { label: "Furniture:", value: property?.["home-furniture"] || "" },
    {
      label: "Conditioning:",
      value: property?.["home-conditioning"] || "",
    },
    { label: "Elevator:", value: property?.["home-elevator"] || "" },
    { label: "Heating:", value: property?.["home-heating"] || "" },
    { label: "Garden:", value: property?.["home-garden"] || "" },
    { label: "Free:", value: property?.["home-free"] || "" },
    { label: "Property class:", value: property?.["home-class"] || "" },
    { label: "Year of construction:", value: property?.["home-year"] || "" },
    {
      label: "Property Type:",
      value: property?.["home-type"] || "",
    },
    { label: "Concierge:", value: property?.["home-concierge"] || "" },
  ];

  const arCharacteristics = [
    { label: "المسلسل:", value: property?.id || "" },
    { label: "الطابق:", value: property?.["home-floor"] || "" },
    { label: "المربع:", value: property?.["home-box"] || "" },
    { label: "المواقف:", value: property?.["home-parking"] || "" },
    { label: "البالكونات:", value: property?.["home-balconies"] || "" },
    { label: "الغرف:", value: property?.["home-bedrooms"] || "" },
    { label: "الأثاث:", value: property?.["home-furniture"] || "" },
    {
      label: "التكييف:",
      value: property?.["home-conditioning"] || "",
    },
    { label: "المصعد:", value: property?.["home-elevator"] || "" },
    { label: "التدفئة:", value: property?.["home-heating"] || "" },
    { label: "الحديقة:", value: property?.["home-garden"] || "" },
    { label: "المجانية:", value: property?.["home-free"] || "" },
    { label: "فئة العقار:", value: property?.["home-class"] || "" },
    { label: "سنة البناء:", value: property?.["home-year"] || "" },
    {
      label: "نوع العقار:",
      value: property?.["home-type"] || "",
    },
    { label: "المسؤول:", value: property?.["home-concierge"] || "" },
  ];

  const visibleCharacteristics = showAll
    ? locale === "ar"
      ? arCharacteristics
      : enCharacteristics
    : locale === "ar"
    ? arCharacteristics.slice(0, 5)
    : enCharacteristics.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <ScrollText size={16} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold">
          {locale === "en" ? "Characteristics" : "المميزات"}
        </h2>
      </div>

      <div className="space-y-4">
        {visibleCharacteristics.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {locale === "en" ? "SHOW ALL" : "عرض الكل"}
        </button>
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto relative z-[99999]"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ScrollText size={16} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {locale === "en" ? "Characteristics" : "المميزات"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoClose size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {visibleCharacteristics.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Characteristics;
