"use client";

import { useRef } from "react";
import L from "leaflet";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { getHomes } from "@/services/properties";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams } from "next/navigation";
import PropertyCard from "@/app/[locale]/cities/[cityId]/components/property-card";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Map from "@/components/shared/Map";

const MainSearchPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const mapRef = useRef<L.Map>(null);

  const { data: homesResponse, isLoading } = useQuery({
    queryKey: ["homes", params.type, searchParams.toString()],
    queryFn: async () => {
      return await getHomes(
        {
          type: params.type as "sale" | "rent",
          home_name: searchParams.get("home_name") || undefined,
        },
        locale
      );
    },
  });

  const properties = homesResponse?.data || [];
  const selectedProperty = properties.length > 0 ? properties[0] : null;
  const center = selectedProperty
    ? [parseFloat(selectedProperty.lat), parseFloat(selectedProperty.lon)]
    : [51.505, -0.09];
  const zoom = selectedProperty ? 15 : 13;

  const breadcrumbItems = [
    {
      label: locale === "en" ? "Home" : "الرئيسية",
      href: "/",
    },
    {
      label: locale === "en" ? "Search Results" : "نتائج البحث",
      href: `#`,
    },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="hidden lg:block lg:w-1/2 h-[calc(100vh-200px)] rounded-lg overflow-hidden sticky top-24">
          <Map
            center={center as [number, number]}
            zoom={zoom}
            properties={properties}
            selectedProperty={selectedProperty}
            onMarkerClick={(property) => {
              if (mapRef.current && property.lat && property.lon) {
                const newCenter: [number, number] = [
                  parseFloat(property.lat),
                  parseFloat(property.lon),
                ];
                mapRef.current.setView(newCenter, 16);
              }
            }}
          />
        </div>

        <div className="lg:w-1/2">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-4 flex items-center justify-between px-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {locale === "en" ? "Search Results for" : "نتائج البحث عن"}{" "}
                <span className="text-blue-600">
                  {searchParams.get("home_name") || ""}
                </span>
              </h1>
              <span className="text-sm text-gray-500">
                {properties.length} {locale === "en" ? "properties" : "عقار"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-min">
            {isLoading ? (
              <div className="flex justify-center items-center col-span-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => {
                    if (mapRef.current && property.lat && property.lon) {
                      const newCenter: [number, number] = [
                        parseFloat(property.lat),
                        parseFloat(property.lon),
                      ];
                      mapRef.current.setView(newCenter, 16);
                    }
                  }}
                />
              ))
            ) : (
              <div className="flex justify-center items-center col-span-full">
                <p className="text-gray-500">
                  {locale === "en"
                    ? "No properties found"
                    : "لا يوجد عقارات مطابقة"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearchPage;
