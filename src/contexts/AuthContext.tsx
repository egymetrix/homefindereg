"use client";
import { createContext, useContext } from "react";
import { AuthResponse, AuthState } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

interface AuthContextType extends AuthState {
  login: (response: AuthResponse) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
