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
    // Try to get from js-cookie
    const value = Cookies.get(name);

    // If not found, try to parse from document.cookie directly (backup method)
    if (!value && typeof document !== "undefined") {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : undefined;
    }

    return value;
  },

  // Set a cookie
  set: (name: string, value: string, options?: CookieOptions) => {
    Cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
      path: "/",
      expires: options?.expires || 1,
    });

    // Also try to set directly (backup method)
    if (typeof document !== "undefined") {
      const expires = options?.expires
        ? typeof options.expires === "number"
          ? `; max-age=${options.expires * 86400}`
          : `; expires=${options.expires.toUTCString()}`
        : "; max-age=86400";

      document.cookie = `${name}=${value}${expires}; path=${
        options?.path || "/"
      };${
        options?.secure || process.env.NODE_ENV === "production"
          ? " secure;"
          : ""
      }${
        options?.sameSite
          ? ` samesite=${options.sameSite};`
          : " samesite=strict;"
      }`;
    }
  },

  // Remove a cookie
  remove: (name: string, options?: CookieOptions) => {
    Cookies.remove(name, options);

    // Also try to remove directly (backup method)
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; max-age=-1; path=${options?.path || "/"};`;
    }
  },

  // Get all cookies
  getAll: () => {
    return Cookies.get();
  },
};
