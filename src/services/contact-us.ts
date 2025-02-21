/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { clientPost } from "@/services/api";

export const contactUs = async (data: any, locale: string) => {
  const response = await clientPost("/site/contactus-request", data, locale);
  return response;
};
