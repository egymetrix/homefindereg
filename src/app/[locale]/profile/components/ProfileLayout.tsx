"use client";

import { ReactNode } from "react";
import Header from "@/components/shared/Header";
import ProfileSidebar from "./ProfileSidebar";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div>
      <Header withBg withShadow />
      <div className="max-w-screen-xl min-h-screen mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div>
            <ProfileSidebar />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
