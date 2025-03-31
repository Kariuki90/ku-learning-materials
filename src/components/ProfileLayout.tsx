import React from "react";
import ProfileNavigation from "./ProfileNavigation";
import ProfileStats from "./ProfileStats";

interface ProfileLayoutProps {
  children: React.ReactNode;
  showStats?: boolean;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, showStats = true }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and view your activity
        </p>
      </div>

      <ProfileNavigation />
      {showStats && <ProfileStats />}
      {children}
    </div>
  );
};

export default ProfileLayout;
