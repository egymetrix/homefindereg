"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { cookies } from "@/lib/cookies";
import { clientGetUser } from "@/services/api";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * A component that listens for authentication messages from popup windows
 * Add this component to your layout to handle authentication from popup windows
 */
export default function AuthListener() {
  const { checkAuth } = useAuth();
  const { login } = useAuthContext();

  useEffect(() => {
    const handleAuthMessage = async (event: MessageEvent) => {
      // Check for authentication success messages
      if (
        event.data === "authentication-successful" ||
        (typeof event.data === "object" &&
          event.data.type === "authentication-successful")
      ) {
        // Extract token from message if available
        if (typeof event.data === "object" && event.data.token) {
          const token = event.data.token;

          // Store token in cookie
          cookies.set("token", token, {
            expires: 1, // 1 day
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          try {
            // Fetch user data directly
            const userData = await clientGetUser(token);
            if (userData && userData.user) {
              login({ token, user: userData.user });
              toast.success("Successfully logged in!");
            } else {
              toast.error("Failed to get user data");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Authentication error");
          }
        } else {
          // If no token in message, use the original checkAuth method
          checkAuth();
          toast.success("Successfully logged in!");
        }
      }
    };

    // Listen for messages from the authentication window
    window.addEventListener("message", handleAuthMessage);

    // Clean up on unmount
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [checkAuth, login]);

  // This component doesn't render anything
  return null;
}
