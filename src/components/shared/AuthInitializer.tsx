"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { cookies } from "@/lib/cookies";
import { clientGetUser } from "@/services/api";
import { useEffect } from "react";

export default function AuthInitializer() {
  const { login } = useAuthContext();

  // Check for token and fetch user data when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = cookies.get("token");

        if (token) {
          const userData = await clientGetUser(token);

          if (userData && userData.user) {
            // Use the login function from AuthContext
            login({ token, user: userData.user });
          } else {
            cookies.remove("token");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid token
        cookies.remove("token");
      }
    };

    checkAuth();
  }, [login]);

  return null; // This component doesn't render anything
}
