"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { cookies } from "@/lib/cookies";
import { clientGetUser } from "@/services/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login } = useAuthContext();
  // Check for token and fetch user data when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = cookies.get("token");
        console.log("Initial auth check, token:", token);

        if (token) {
          console.log("Found token, fetching user data");
          const userData = await clientGetUser(token);
          console.log("User data on initial load:", userData);

          if (userData && userData.user) {
            // Use the login function from AuthContext
            login({ token, user: userData.user });
            console.log("User authenticated from stored token");
          } else {
            console.log("Valid token but no user data, clearing token");
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
