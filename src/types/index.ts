/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
  id: number;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  government_id: number;
  created_at: string;
  updated_at: string;
}

export interface Government {
  id: number;
  name: string;
  type: string;
  category_type: string;
  city_count: number;
  cities: City[];
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: any[];
  custom_properties: any[];
  generated_conversions: any[];
  responsive_images: any[];
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
}

export interface OtherFeature {
  id: number;
  home_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyMedia {
  id: number;
  model_id: number;
  model_type: string;
  collection_name: string;
  file_name: string;
  disk: string;
  original_url: string;
  preview_url: string;
}

export interface Property {
  id: number;
  lon: string;
  lat: string;
  home_name: string;
  address: string;
  home_price: string;
  home_bedrooms: number;
  home_bathrooms: number;
  home_kitchens: number;
  home_area: string;
  home_heating: string;
  home_garage: string;
  home_pool: string;
  home_neighborhood: string;
  home_description: string;
  government_id: number;
  city_id: number;
  home_floor: string;
  home_box: string;
  home_parking: string;
  home_balconies: string;
  home_furniture: string;
  home_conditioning: string;
  home_elevator: string;
  home_garden: string;
  home_free: string;
  home_class: string;
  home_year: string;
  home_type: string;
  home_concierge: string;
  created_at: string;
  updated_at: string;
  other_features: OtherFeature[];
  media: PropertyMedia[];
}
