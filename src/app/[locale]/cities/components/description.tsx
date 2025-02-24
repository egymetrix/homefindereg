"use client";

import { useLocale } from "next-intl";

const Description = () => {
  const locale = useLocale();

  const descriptions = {
    title: {
      en: "Find Your Perfect Property",
      ar: "ابحث عن عقارك المثالي",
    },
    content: {
      en: "Whether you're looking to buy or rent, we offer an exclusive selection of properties to match your needs. From luxurious homes for sale to premium rental apartments, our diverse portfolio spans across prime locations, ensuring you find the perfect space that suits your lifestyle and preferences.",
      ar: "سواء كنت تبحث عن الشراء أو الإيجار، نقدم مجموعة حصرية من العقارات لتلبية احتياجاتك. من المنازل الفاخرة للبيع إلى الشقق الراقية للإيجار، تمتد محفظتنا المتنوعة عبر مواقع متميزة، مما يضمن لك العثور على المساحة المثالية التي تناسب نمط حياتك وتفضيلاتك.",
    },
  };

  return (
    <section id="estates" className="bg-gray-50 py-8 mx-auto">
      <div className="container mx-auto px-4">
        <div className="p-8">
          <h2
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              locale === "ar" ? "text-right" : "text-left"
            }`}
          >
            {descriptions.title[locale as "en" | "ar"]}
          </h2>
          <p
            className={`text-gray-600 leading-relaxed ${
              locale === "ar" ? "text-right" : "text-left"
            }`}
          >
            {descriptions.content[locale as "en" | "ar"]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Description;
