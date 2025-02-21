"use server";

import { Property } from "@/types";
import { clientGet } from "@/services/api";

interface GetHomesParams {
  city_id?: string;
  category_type?: string;
  type?: "sale" | "rent";
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
  home_name?: string;
  home_bathrooms?: string;
  home_kitchens?: string;
}

export const getHomes = async (params: GetHomesParams, locale: string) => {
  const searchParams = new URLSearchParams();

  // Add required parameter
  if (params.city_id) searchParams.append("city_id", params.city_id);

  // Add optional parameters if they exist
  if (params.category_type)
    searchParams.append("category_type", params.category_type);
  if (params.type) searchParams.append("type", params.type);
  if (params.min_price) searchParams.append("min_price", params.min_price);
  if (params.max_price) searchParams.append("max_price", params.max_price);
  if (params.min_area) searchParams.append("min_area", params.min_area);
  if (params.max_area) searchParams.append("max_area", params.max_area);
  if (params.home_name) searchParams.append("home_name", params.home_name);
  if (params.home_bathrooms)
    searchParams.append("home_bathrooms", params.home_bathrooms);
  if (params.home_kitchens)
    searchParams.append("home_kitchens", params.home_kitchens);

  return await clientGet<{ data: Property[] }>(
    `/site/get-homes?${searchParams.toString()}`,
    locale
  );
};

export const getProperty = async (propertyId: string, locale: string) => {
  return await clientGet<{ data: Property }>(
    `/site/get-home?id=${propertyId}`,
    locale
  );
};

export const getAppointments = async (locale: string) => {
  return await clientGet(`/site/get-appointment`, locale);
};
