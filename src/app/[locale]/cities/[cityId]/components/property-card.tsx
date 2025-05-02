"use client";

import { Card } from "@/components/ui/card";
import { Property } from "@/types";
import { Bath, Bed, Heart, Ruler } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { addToFavorites } from "@/services/properties";
import { MouseEvent, useState } from "react";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(property.is_favorite === 1);
  const t = useTranslations("home");
  const locale = useLocale();

  const handleFavoriteClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      await addToFavorites(
        property.id.toString(),
        newFavoriteStatus ? "1" : "0"
      );
    } catch (error) {
      // Revert state if API call fails
      setIsFavorite(!newFavoriteStatus);
      console.error("Failed to update favorite status:", error);
    }
  };

  return (
    <Link href={`/properties/${`${property.home_name}-${property.id}`}`}>
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
            <span className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
              {locale === "ar"
                ? `${property.home_price} ج.م`
                : `${property.home_price} $`}
            </span>

            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
              />
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
