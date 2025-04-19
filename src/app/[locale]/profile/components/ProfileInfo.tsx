"use client";

import { User } from "@/types/auth";

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <div className="mt-4">
      <p className="text-lg">Name: {user.name}</p>
      <p className="text-lg">Email: {user.email}</p>
      {user.phone && <p className="text-lg">Phone: {user.phone}</p>}
    </div>
  );
};

export default ProfileInfo;
