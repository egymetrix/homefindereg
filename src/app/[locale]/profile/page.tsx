"use client";

import { useEffect } from "react";
import Header from "@/components/shared/Header";
import { useAuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import ProfileInfo from "./components/ProfileInfo";
import ProfileLoading from "./components/ProfileLoading";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

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
    <div>
      <Header withBg withShadow />
      <div className="max-w-screen-xl min-h-screen mx-auto py-3">
        <div className="px-4 sm:px-6 lg:px-8 text-center my-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          {user && <ProfileInfo user={user} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
