"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

/**
 * A component that listens for authentication messages from popup windows
 * Add this component to your layout to handle authentication from popup windows
 */
export default function AuthListener() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data === "authentication-successful") {
        console.log("Authentication successful via popup window");
        // Refresh auth state to get the user data with the token from cookies
        checkAuth();
        toast.success("Successfully logged in!");
      }
    };

    // Listen for messages from the authentication window
    window.addEventListener("message", handleAuthMessage);

    // Clean up on unmount
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [checkAuth]);

  // This component doesn't render anything
  return null;
}
