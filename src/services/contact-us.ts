/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverPost } from "@/services/api";

export const contactUs = async (data: any) => {
  const response = await serverPost("/site/contactus-request", data);
  console.log("response", response);
  return response;
};
