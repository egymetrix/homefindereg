import { useTranslations } from "next-intl";
import { FaHome, FaHandshake, FaChartLine } from "react-icons/fa";

export default function OurMission() {
  const t = useTranslations("About");

  const values = [
    {
      icon: <FaHome className="h-8 w-8 text-primary" />,
      title: t("mission.values.quality.title"),
      description: t("mission.values.quality.description"),
    },
    {
      icon: <FaHandshake className="h-8 w-8 text-primary" />,
      title: t("mission.values.trust.title"),
      description: t("mission.values.trust.description"),
    },
    {
      icon: <FaChartLine className="h-8 w-8 text-primary" />,
      title: t("mission.values.growth.title"),
      description: t("mission.values.growth.description"),
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container px-4 mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("mission.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t("mission.description")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-100 p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
