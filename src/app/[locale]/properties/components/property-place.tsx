"use client";

import { Property } from "@/types";
import { useLocale } from "next-intl";
import { MapPin, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

const PropertyPlace = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();
  const [showFullMap, setShowFullMap] = useState(false);

  if (!property || !property.lat || !property.lon) return null;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {locale === "ar" ? "الموقع" : "Location"}
          </h2>
        </div>

        <div className="relative h-[300px] rounded-xl overflow-hidden [&_.leaflet-pane]:!z-[50] [&_.leaflet-top]:!z-[51] [&_.leaflet-bottom]:!z-[51]">
          <Map
            center={[parseFloat(property.lat), parseFloat(property.lon)]}
            zoom={15}
            properties={[property]}
            selectedProperty={property}
          />
          <button
            onClick={() => setShowFullMap(true)}
            className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Maximize2 className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFullMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white z-[94]"
          >
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
              <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {locale === "ar" ? "الموقع" : "Location"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowFullMap(false)}
                  className="p-2.5 hover:bg-red-50 rounded-full transition-colors duration-300 text-gray-600 hover:text-red-500"
                >
                  <IoClose size={24} />
                </button>
              </div>
            </div>

            <div className="h-full w-full pt-20 pb-8 px-8">
              <div className="w-full h-full max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <Map
                  center={[parseFloat(property.lat), parseFloat(property.lon)]}
                  zoom={15}
                  properties={[property]}
                  selectedProperty={property}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyPlace;
