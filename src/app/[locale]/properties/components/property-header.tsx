/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Bed,
  Bath,
  Heart,
  Ruler,
  Share2,
  XIcon as X,
  Copy,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Property } from "@/types";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  XIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { addToFavorites } from "@/services/properties";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface PropertyHeaderProps {
  property: Property | undefined;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const locale = useLocale();
  const t = useTranslations("home");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}${pathname}`;
  const shareTitle = `${property?.home_name} - ${locale === "ar"
    ? `${property?.home_price} ج.م`
    : `${property?.home_price} $`
    }`;

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (!property) return;

    // Get favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    // Check if current property is in favorites
    const isPropertyFavorite =
      favorites.includes(property.id.toString()) || property?.is_favorite === 1;
    setIsFavorite(isPropertyFavorite);
  }, [property]);

  const handleFavoriteClick = async () => {
    if (!property) return;

    // If user is not authenticated, show toast message
    if (!isAuthenticated) {
      toast.error(locale === "ar"
        ? "يرجى تسجيل الدخول لإضافة العقارات إلى المفضلة."
        : "Please log in to add properties to your favorites.");
      return;
    }

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update localStorage
    updateLocalStorage(newFavoriteStatus);

    try {
      await addToFavorites(
        property.id.toString(),
        newFavoriteStatus ? "1" : "0"
      );

      toast.success(newFavoriteStatus
        ? locale === "ar"
          ? "تم إضافة العقار إلى المفضلة داخل حسابك."
          : "The property has been added to your favorites in your account."
        : locale === "ar"
          ? "تم إزالة العقار من المفضلة داخل حسابك."
          : "The property has been removed from your favorites in your account.");
    } catch (error) {
      // Revert state if API call fails
      setIsFavorite(!newFavoriteStatus);
      toast.error(locale === "ar"
        ? "حدث خطأ أثناء تحديث حالة المفضلة."
        : "An error occurred while updating the favorite status.");
    }
  };

  const updateLocalStorage = (isFav: boolean) => {
    if (!property) return;

    // Get favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFav) {
      // Add to favorites if not already included
      if (!favorites.includes(property.id.toString())) {
        favorites.push(property.id.toString());
      }
    } else {
      // Remove from favorites
      const index = favorites.indexOf(property.id.toString());
      if (index !== -1) {
        favorites.splice(index, 1);
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!property)
    return (
      <div className="text-center py-10">
        <p className="text-2xl font-bold text-gray-500">
          {locale === "en" ? "Property not found" : "العقار غير موجود"}
        </p>
      </div>
    );

  return (
    <div className="border-y shadow-sm sticky top-[69px] bg-white z-[95]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between p-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1 py-3">
            <p className="text-lg md:text-2xl font-bold">
              {locale === "ar"
                ? `${property.home_price} ج.م`
                : `${property.home_price} $`}
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-[#ef9393]" />
                <span className="text-xs md:text-sm">
                  {property.home_bedrooms} {t("bedrooms")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4 text-[#b663d7]" />
                <span className="text-xs md:text-sm">
                  {property.home_area} {t("area")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-[#8ec7d5]" />
                <span className="text-xs md:text-sm">
                  {property.home_bathrooms} {t("bathrooms")}
                </span>
              </div>
            </div>
          </div>
          <div className="h-16 w-px bg-gray-200 hidden md:block" />
          <div className="flex flex-col gap-1 py-3">
            <p className="text-lg md:text-2xl font-bold">
              {property.home_name}
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              {property.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
            />
          </button>
          <div className="relative">
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-5 h-5" />
            </button>

            {showShareMenu && (
              <div
                className={cn(
                  "absolute mt-2 p-3 bg-white rounded-lg shadow-lg z-50 min-w-[200px]",
                  locale === "en" ? "right-0" : "left-0"
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t("shareVia")}
                    </span>
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-start gap-3">
                    <FacebookShareButton url={shareUrl} title={shareTitle}>
                      <div className="p-2 hover:bg-gray-100 rounded-lg">
                        <FacebookIcon size={24} round />
                      </div>
                    </FacebookShareButton>
                    <WhatsappShareButton url={shareUrl} title={shareTitle}>
                      <div className="p-2 hover:bg-gray-100 rounded-lg">
                        <WhatsappIcon size={24} round />
                      </div>
                    </WhatsappShareButton>
                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                      <div className="p-2 hover:bg-gray-100 rounded-lg">
                        <XIcon size={24} round />
                      </div>
                    </TwitterShareButton>
                    <TelegramShareButton url={shareUrl} title={shareTitle}>
                      <div className="p-2 hover:bg-gray-100 rounded-lg">
                        <TelegramIcon size={24} round />
                      </div>
                    </TelegramShareButton>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {copied ? t("copied") : t("copyLink")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
