"use server";

import { Property } from "@/types";
import { clientGet } from "@/services/api";

interface ServiceData {
  id: number;
  title: string;
  content: string;
  media: { original_url: string }[];
}

interface ServiceResponse {
  success: boolean;
  status: number;
  message: string;
  data: ServiceData;
}

interface GetHomesParams {
  city_id?: string;
  category_id?: string;
  type?: "sale" | "rent";
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
  home_name?: string;
  home_bathrooms?: string;
  home_kitchens?: string;
  city_name?: string;
}

export const getHomes = async (params: GetHomesParams) => {
  const searchParams = new URLSearchParams();

  // Add required parameter
  if (params.city_id) searchParams.append("city_id", params.city_id);

  // Add optional parameters if they exist
  if (params.category_id)
    searchParams.append("category_id", params.category_id);
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
  if (params.city_name) searchParams.append("city_name", params.city_name);

  const res = await clientGet<{ data: Property[] }>(
    `/site/get-homes?${searchParams.toString()}`
  );

  return res;
};

export const getProperty = async (propertyId: string) => {
  return await clientGet<{ data: Property; HomeSuggest: Property[] }>(
    `/site/get-home?id=${propertyId}`
  );
};

export const getAppointments = async () => {
  return await clientGet(`/site/get-appointment`);
};

export const addToFavorites = async (
  propertyId: string,
  isFavorite: string
) => {
  return await clientGet(
    `/site/is-favorite?id=${propertyId}&is_favorite=${isFavorite}`
  );
};

export const getFAQ = async () => {
  return await clientGet(`/site/get-faq`);
};

export const getPrivacyPolicy = async () => {
  return await clientGet(`/site/privacy-policy`);
};

export const getAboutUs = async () => {
  return await clientGet(`/site/get-aboutus`);
};

export const getPropertyEvaluation = async () => {
  return await clientGet<ServiceResponse>(`/site/get-property-evaluation`);
};

export const getEngineeringConsultant = async () => {
  return await clientGet<ServiceResponse>(`/site/get-engineering-consultants`);
};

export const getThermalInsulation = async () => {
  return await clientGet<ServiceResponse>(`/site/get-thermal-insulation`);
};
