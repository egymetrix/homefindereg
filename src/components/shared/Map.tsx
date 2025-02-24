"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Property } from "@/types";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface MapProps {
  center: [number, number];
  zoom?: number;
  properties: Property[];
  selectedProperty?: Property | null;
  onMarkerClick?: (property: Property) => void;
}

const customIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div class="relative">
      <div class="absolute -top-8 -left-4 bg-white rounded-full p-2 shadow-lg transform-gpu transition-transform duration-200 hover:scale-110">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div class="w-2 h-2 bg-blue-500 rotate-45"></div>
        </div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 0],
  popupAnchor: [0, -20],
});

// Update the Popup component with better styling
const CustomPopup = ({ property }: { property: Property }) => (
  <div className="min-w-[200px]">
    <div className="relative h-32 mb-2">
      {property.media && property.media[0] && (
        <Image
          fill
          src={property.media[0].original_url}
          alt={property.home_name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      )}
      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
        ${property.home_price}
      </div>
    </div>
    <div className="p-2">
      <Link
        href={`/properties/${property.id}`}
        className="font-semibold text-gray-800 mb-1"
      >
        {property.home_name}
      </Link>
      <p className="text-sm text-gray-500 truncate">{property.address}</p>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
        <span>{property.home_bedrooms} beds</span>
        <span>•</span>
        <span>{property.home_bathrooms} baths</span>
        <span>•</span>
        <span>{property.home_area} m²</span>
      </div>
    </div>
  </div>
);

// Selected icon style
const selectedIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `
    <div class="relative">
      <div class="absolute -top-8 -left-4 bg-white rounded-full p-2 shadow-lg transform-gpu transition-transform duration-200 scale-110">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold ring-4 ring-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div class="w-2 h-2 bg-blue-600 rotate-45"></div>
        </div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 0],
  popupAnchor: [0, -20],
});

// Add styles to your global CSS or create a new CSS module
const markerStyles = `
  .custom-marker-icon {
    background: transparent;
    border: none;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
  }
  
  .leaflet-popup-content {
    margin: 0;
    padding: 12px;
  }
`;

// Add the styles to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = markerStyles;
  document.head.appendChild(style);
}

// Map updater component
const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    console.log("Setting map view to:", center, zoom);
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

const Map = ({
  center,
  zoom = 13,
  properties,
  selectedProperty,
  onMarkerClick,
}: MapProps) => {
  const mapRef = useRef<L.Map>(null);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[parseFloat(property.lat), parseFloat(property.lon)]}
          icon={
            property.id === selectedProperty?.id ? selectedIcon : customIcon
          }
          eventHandlers={{
            click: () => onMarkerClick?.(property),
          }}
        >
          <Popup>
            <CustomPopup property={property} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
