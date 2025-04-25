"use server";

import { cookies } from "@/lib/cookies";
import axios from "axios";
import { getLocale } from "next-intl/server";
import { cookies as nextCookies } from "next/headers";

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
    Authorization: `Bearer ${cookies.get("token")}`,
  },
});

export async function serverGet<T>(endpoint: string) {
  const locale = await getLocale();
  const response = await serverAxios.get<T>(endpoint, {
    headers: { lang: locale },
  });
  return response.data;
}

export async function serverPost<T>(endpoint: string, formData: FormData) {
  const locale = await getLocale();
  const response = await serverAxios.post<T>(endpoint, formData, {
    headers: {
      lang: locale,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Client-side functions
export async function clientGet<T>(endpoint: string) {
  "use client";
  const locale = await getLocale();
  const response = await clientAxios.get<T>(endpoint, {
    headers: {
      lang: locale,
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
  return response?.data;
}

export async function clientGetUser(token: string) {
  "use client";
  const response = await clientAxios.get("/site/get-user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response?.data);
  return response?.data;
}

export async function clientPost<T>(endpoint: string, formData: FormData) {
  "use client";
  const locale = await getLocale();
  const token = (await nextCookies()).get("token")?.value;
  console.log(token);
  const response = await clientAxios.post<T>(endpoint, formData, {
    headers: {
      lang: locale,
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

serverAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    console.log(message);
  }
);

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    console.log(message);
  }
);
