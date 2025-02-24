import { Property } from "@/types";
import { useLocale } from "next-intl";
import { ListChecks } from "lucide-react";

const OtherFeatures = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();

  if (!property?.other_features || property.other_features.length === 0)
    return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {locale === "ar" ? "مميزات أخرى" : "Other Features"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {property.other_features.map((feature) => (
          <div
            key={feature.id}
            className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 group hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-sm text-gray-700">{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherFeatures;
