/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Property } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoImages,
  IoVideocam,
  IoMap,
  IoClose,
} from "react-icons/io5";
import { TbRotate360 } from "react-icons/tb";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { IconType } from "react-icons";

// Dynamically import Pannellum with SSR disabled
const Pannellum = dynamic(
  () => import("pannellum-react").then((mod) => mod.Pannellum),
  { ssr: false }
);

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

// Add TypeScript interfaces
interface MediaCollection {
  gallery: Media[];
  videos: Media[];
  panorama: Media[];
}

interface Media {
  collection_name?: string;
  original_url: string;
}

interface ViewButton {
  icon: IconType;
  label: string;
  view: ViewType;
  show?: boolean;
}

type ViewType = "gallery" | "video" | "panorama" | "map";

const VIEW_BUTTONS = (t: any, collections: MediaCollection): ViewButton[] => [
  {
    icon: IoVideocam,
    label: t("video"),
    view: "video",
    show: collections.videos.length > 0,
  },
  {
    icon: TbRotate360,
    label: t("video_360"),
    view: "panorama",
    show: collections.panorama.length > 0,
  },
  { icon: IoImages, label: t("photo"), view: "gallery", show: true },
  { icon: IoMap, label: t("map"), view: "map", show: true },
];

const useMediaCollections = (data: Property | undefined) => {
  if (!data?.media) return null;

  return {
    main: data.media.filter((m) => m.collection_name === "Home-main"),
    gallery: data.media.filter(
      (m) => m.collection_name === "Home-Gallery" || !m.collection_name
    ),
    videos: data.media.filter((m) => m.collection_name === "HomeVideo"),
    panorama: data.media.filter((m) => m.collection_name === "HomeVideo3d"),
  };
};

const ImageThumbnail = ({
  image,
  index,
  isActive,
  onClick,
}: {
  image: Media;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden snap-center 
      ${isActive ? "ring-2 ring-green-500" : "ring-1 ring-white/20"}`}
  >
    <Image
      src={image.original_url}
      alt={`Thumbnail ${index + 1}`}
      fill
      className="object-cover"
    />
  </motion.button>
);

const ImageGallery = ({ data }: { data: Property | undefined }) => {
  const t = useTranslations("properties");
  const mediaCollections = useMediaCollections(data);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("gallery");
  const [showThumbnails, setShowThumbnails] = useState(false);

  // Get actual images to display, either gallery, main or empty
  const getImagesForDisplay = () => {
    if (!mediaCollections) return [];
    // If gallery has images, use them
    if (mediaCollections.gallery.length > 0) return mediaCollections.gallery;
    // If no gallery but have main images, use them
    if (mediaCollections.main.length > 0) return mediaCollections.main;
    // No images available
    return [];
  };

  const displayImages = getImagesForDisplay();
  const hasImages = displayImages.length > 0;

  useEffect(() => {
    if (currentImageIndex >= (displayImages.length || 0)) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, displayImages]);

  if (!mediaCollections) return null;

  if (!hasImages) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="h-[400px] md:h-[600px] bg-gray-50 p-4 sm:p-6 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <IoImages className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-700">
              {t("noImagesAvailable") || "No images provided for this property"}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    if (!displayImages.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!displayImages.length) return;
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };
  const renderFullScreenContent = () => {
    try {
      switch (activeView) {
        case "map":
          return data?.lat && data?.lon ? (
            <div className="w-full h-full mx-auto rounded-xl overflow-hidden">
              <Map
                center={[parseFloat(data.lat), parseFloat(data.lon)]}
                zoom={15}
                properties={[data]}
                selectedProperty={data}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">{t("mapNotAvailable")}</p>
            </div>
          );
        case "video":
          return mediaCollections.videos[0]?.original_url ? (
            <video
              controls
              className="w-full h-full object-contain"
              src={mediaCollections.videos[0].original_url}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">{t("videoNotAvailable")}</p>
            </div>
          );
        case "panorama":
          return (
            <div className="w-full h-full relative group">
              {mediaCollections.panorama[0]?.original_url && (
                <Pannellum
                  id="panorama-viewer"
                  width="100%"
                  height="100%"
                  image={mediaCollections?.panorama[0]?.original_url}
                  pitch={10}
                  yaw={180}
                  hfov={110}
                  autoLoad
                  className="panorama-viewer"
                  onLoad={() => {
                    console.log("panorama loaded");
                  }}
                />
              )}
            </div>
          );
        default:
          return (
            <div className="relative w-full h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={displayImages[currentImageIndex]?.original_url}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                {showThumbnails && displayImages.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-black/80 p-4 rounded-xl mb-4 backdrop-blur-sm"
                  >
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {displayImages.map((image, idx) => (
                        <ImageThumbnail
                          key={idx}
                          image={image}
                          index={idx}
                          isActive={currentImageIndex === idx}
                          onClick={() => setCurrentImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  {displayImages.length > 1 && (
                    <motion.button
                      onClick={() => setShowThumbnails(!showThumbnails)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 text-white"
                    >
                      {showThumbnails
                        ? t("hideThumbnails")
                        : t("showThumbnails")}
                    </motion.button>
                  )}
                  <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                    {currentImageIndex + 1} / {displayImages.length}
                  </span>
                </div>
              </div>

              {displayImages.length > 1 && (
                <>
                  <motion.button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full
                             transition-all duration-300 group shadow-lg"
                    whileHover={{ scale: 1.1, x: -4 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoChevronBack
                      size={24}
                      className="text-gray-800 group-hover:text-gray-900"
                    />
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full
                             transition-all duration-300 group shadow-lg"
                    whileHover={{ scale: 1.1, x: 4 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoChevronForward
                      size={24}
                      className="text-gray-800 group-hover:text-gray-900"
                    />
                  </motion.button>
                </>
              )}

              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {displayImages.length}
                </span>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering content:", error);
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{t("errorLoadingContent")}</p>
        </div>
      );
    }
  };
  return (
    <div className="max-w-7xl mx-auto">
      <div
        className={`grid grid-cols-1 ${displayImages.length > 1 ? "md:grid-cols-[2fr,1fr]" : "md:grid-cols-1"
          } gap-6 h-[400px] md:h-[600px] bg-gray-50 p-4 sm:p-6 rounded-xl`}
      >
        <div
          className="relative rounded-xl overflow-hidden shadow-lg h-full cursor-pointer group"
          onClick={() => {
            setActiveView("gallery");
            setShowGallery(true);
          }}
        >
          <Image
            src={displayImages[currentImageIndex]?.original_url}
            alt="Main property image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
            <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
              {VIEW_BUTTONS(t, mediaCollections)
                .filter((btn) => btn.show !== false)
                .map((Button, index) => (
                  <motion.button
                    key={index}
                    className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-md
                      backdrop-blur-sm border text-gray-700 transition-all duration-300 border-white/40 hover:bg-primary hover:text-white shadow-sm text-sm md:text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView(Button.view as any);
                      setShowGallery(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button.icon className="" size={20} />
                    <span className="text-xs">{Button.label}</span>
                  </motion.button>
                ))}
            </div>
          </div>
        </div>

        {displayImages.length > 1 && (
          <div className="hidden md:grid grid-rows-3 gap-3 h-full">
            {displayImages.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-md cursor-pointer"
                onClick={() => {
                  setActiveView("gallery");
                  setShowGallery(true);
                }}
              >
                <Image
                  src={image.original_url}
                  alt={`Property image ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 33vw) 100vw, 33vw"
                />
                {index === 2 && displayImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <IoImages className="text-white mb-2" size={32} />
                      <span className="text-white text-xl font-semibold">
                        +{displayImages.length - 4}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white z-[99999]"
          >
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
              <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-3 md:py-4 md:px-6 overflow-x-auto">
                <div className="flex gap-2 md:gap-3">
                  {VIEW_BUTTONS(t, mediaCollections)
                    .filter((btn) => btn.show !== false)
                    .map((btn, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setActiveView(btn.view as any)}
                        className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 md:gap-3 flex-shrink-0
                        ${activeView === btn.view
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/50 ring-1 ring-blue-400/30"
                            : "text-gray-700 hover:bg-gray-100/80 hover:shadow-sm ring-1 ring-gray-200/50"
                          } backdrop-blur-sm`}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <btn.icon
                          size={20}
                          className={`${activeView === btn.view
                              ? "text-white"
                              : "text-gray-600"
                            }`}
                        />
                        <span className="text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap">
                          {btn.label}
                        </span>
                      </motion.button>
                    ))}
                </div>
                <motion.button
                  onClick={() => setShowGallery(false)}
                  className="text-gray-600 hover:text-red-500 p-2 md:p-2.5 rounded-full hover:bg-red-50 transition-all duration-300 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoClose size={24} />
                </motion.button>
              </div>
            </div>

            <div className="h-full w-full pt-16 md:pt-20 pb-8 px-2 md:px-8">
              <div className="w-full h-full max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {renderFullScreenContent()}
              </div>
            </div>

            {activeView === "gallery" && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100">
                <div className="max-w-7xl mx-auto py-2 md:py-4 px-3 md:px-6">
                  <div className="flex items-center justify-between">
                    {displayImages.length > 1 && (
                      <motion.button
                        onClick={() => setShowThumbnails(!showThumbnails)}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-gray-700 hover:text-blue-600 px-3 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 md:gap-2.5 border border-gray-200 hover:border-blue-200"
                      >
                        <IoImages size={18} className="flex-shrink-0" />
                        <span className="text-sm md:text-base font-medium whitespace-nowrap">
                          {showThumbnails
                            ? t("hideThumbnails")
                            : t("showThumbnails")}
                        </span>
                      </motion.button>
                    )}
                    <span className="text-sm md:text-base text-gray-700 bg-gray-50 px-3 md:px-5 py-2 md:py-2.5 rounded-xl border border-gray-200">
                      {currentImageIndex + 1} / {displayImages.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
