/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { cookies } from "@/lib/cookies";
import { User, AuthState, AuthResponse } from "@/types/auth";
import { clientGetUser } from "@/services/api";
import { useLocale } from "next-intl";

export const useAuth = () => {
  const locale = useLocale();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const token = cookies.get("token");
      if (!token) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const userData = await clientGetUser(token, locale);
      setAuthState({
        user: userData.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      cookies.remove("token");
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = (response: AuthResponse) => {
    if (response.token) {
      cookies.set("token", response.token, {
        expires: 1, // 1 day
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    setAuthState({
      user: response.user || null,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    cookies.remove("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  useEffect(() => {
    checkAuth();
  }, [locale]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
};
