"use server";

import { cookies } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const serverAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const clientAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function serverGet<T>(endpoint: string, locale: string) {
  const response = await serverAxios.get<T>(endpoint, {
    headers: { lang: locale },
  });
  return response.data;
}

export async function serverPost<T>(
  endpoint: string,
  formData: FormData,
  locale: string
) {
  const response = await serverAxios.post<T>(endpoint, formData, {
    headers: {
      lang: locale,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Client-side functions
export async function clientGet<T>(endpoint: string, locale: string) {
  "use client";
  const response = await clientAxios.get<T>(endpoint, {
    headers: {
      lang: locale,
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
  return response.data;
}

export async function clientGetUser(token: string, locale: string) {
  "use client";
  const response = await clientAxios.get("/site/get-user", {
    headers: { lang: locale, Authorization: `Bearer ${token}` },
  });
  console.log("response.data", response.data);
  return response.data;
}

export async function clientPost<T>(
  endpoint: string,
  formData: FormData,
  locale: string
) {
  "use client";
  const response = await clientAxios.post<T>(endpoint, formData, {
    headers: {
      lang: locale,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

serverAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);
