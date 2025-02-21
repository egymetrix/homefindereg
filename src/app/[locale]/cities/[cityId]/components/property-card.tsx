import { Card } from "@/components/ui/card";
import { Property } from "@/types";
import { Bath, Bed, Heart, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const t = useTranslations("home");
  return (
    <Link href={`/properties/${property.id}`}>
      <Card
        key={property.id}
        className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
      >
        <div className="relative h-48">
          <Image
            fill
            src={property.media[0].original_url}
            alt={property.home_name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              € {Number(property.home_price).toLocaleString()}
            </span>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {property.home_name}
          </h3>
          <p className="text-gray-500 text-sm mb-3">{property.address}</p>

          <div className="flex items-center justify-between text-gray-600 border-t pt-2">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-[#ef9393]" />
              <span className="text-sm">
                {property.home_bedrooms}
                {t("bedrooms")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4 text-[#b663d7]" />
              <span className="text-sm">
                {property.home_area} {t("area")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-[#8ec7d5]" />
              <span className="text-sm">
                {property.home_bathrooms} {t("bathrooms")}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
