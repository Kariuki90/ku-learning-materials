import React from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <nav className="flex space-x-4 px-4 py-3">
        <Link
          to="/profile"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive("/profile")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Profile Settings
        </Link>
        <Link
          to="/profile/password"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive("/profile/password")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Change Password
        </Link>
        <Link
          to="/profile/activity"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive("/profile/activity")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Activity History
        </Link>
      </nav>
    </div>
  );
};

export default ProfileNavigation;
