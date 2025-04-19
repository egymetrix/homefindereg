"use client";

import Header from "@/components/shared/Header";
import { Loader2 } from "lucide-react";

const ProfileLoading = () => {
  return (
    <div>
      <Header withBg withShadow />
      <div className="max-w-screen-xl min-h-screen mx-auto py-3 flex justify-center items-center">
        <div className="px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoading;
