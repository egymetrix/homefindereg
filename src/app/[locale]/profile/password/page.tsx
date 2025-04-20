"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import ProfileLayout from "../components/ProfileLayout";
import ProfileLoading from "../components/ProfileLoading";
import PasswordChange from "../components/PasswordChange";

export default function PasswordPage() {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <ProfileLayout>
      <PasswordChange />
    </ProfileLayout>
  );
}
