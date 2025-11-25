"use client";
import React, { useState } from "react";
import { useSearchParams} from "next/navigation";
import { useUserByIdQuery } from "../../query";
import ProfileTab from "./ProfileEditForm";
import SecurityTab from "./SecurityTab";
import ActivityTab from "./ActivityTab";
export default function EditUserPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "activity"
  >("profile");
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useUserByIdQuery(userId || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004953]"></div>
      </div>
    );
  }
  if (isError || !userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading user data: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#004953] to-[#014852] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userData.dto.profile.firstName.charAt(0)}
                {userData.dto.profile.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.dto.profile.firstName} {userData.dto.profile.lastName}
              </h1>
              <p className="text-gray-600">{userData.dto.profile.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "profile"
                  ? "border-b-2 border-[#004953] text-[#004953]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "security"
                  ? "border-b-2 border-[#004953] text-[#004953]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Security & Password
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "activity"
                  ? "border-b-2 border-[#004953] text-[#004953]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Activity & History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && <ProfileTab userData={userData.dto.profile} />}

          {/* Security Tab */}
          {activeTab === "security" && <SecurityTab/>}

          {/* Activity Tab */}
          {activeTab === "activity" && <ActivityTab userData={userData.dto.activity} />}
        </div>
      </div>
    </div>
  );
}
