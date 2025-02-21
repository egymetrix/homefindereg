import Cookies from "js-cookie";

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const cookies = {
  // Get a cookie
  get: (name: string) => {
    return Cookies.get(name);
  },

  // Set a cookie
  set: (name: string, value: string, options?: CookieOptions) => {
    Cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
      path: "/",
      expires: 1,
    });
  },

  // Remove a cookie
  remove: (name: string, options?: CookieOptions) => {
    Cookies.remove(name, options);
  },

  // Get all cookies
  getAll: () => {
    return Cookies.get();
  },
};
