"use client";

import Header from "@/components/shared/Header";

interface ProfileLayoutProps {
  children: React.ReactNode;
  title: string;
}

const ProfileLayout = ({ children, title }: ProfileLayoutProps) => {
  return (
    <div>
      <Header withBg withShadow />
      <div className="max-w-screen-xl min-h-screen mx-auto py-3">
        <div className="px-4 sm:px-6 lg:px-8 text-center my-auto">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
