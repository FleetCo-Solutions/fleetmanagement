"use client";
import React, { useState } from "react";
import { useSearchParams} from "next/navigation";
import { useUserByIdQuery } from "../../query";
import ProfileTab from "./ProfileEditForm";
import SecurityTab from "./SecurityTab";
import ActivityTab from "./ActivityTab";

import { useAddEmergencyContact, useUpdateEmergencyContact, useDeleteEmergencyContact } from "../../query";
import EmergencyContactForm from "@/app/components/forms/EmergencyContactForm";
import { EmergencyContactPayload } from "@/app/types";
import { toast } from "sonner";

export default function EditUserPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "activity" | "emergency"
  >("profile");
  
  const { mutateAsync: addEmergencyContact } = useAddEmergencyContact(userId || undefined);
  const { mutateAsync: updateEmergencyContactMutate } = useUpdateEmergencyContact(userId || undefined);
  const { mutateAsync: deleteEmergencyContactMutate } = useDeleteEmergencyContact(userId || undefined);

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
            <button
              onClick={() => setActiveTab("emergency")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "emergency"
                  ? "border-b-2 border-[#004953] text-[#004953]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Emergency Contact
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

          {/* Emergency Contact Tab */}
          {activeTab === "emergency" && (
             <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm">
               <EmergencyContactForm
                contacts={userData.dto.emergencyContacts}
                onSave={async (contacts) => {
                  try {
                    const promises = [];

                    // Handle Updates and Adds
                    for (const contact of contacts) {
                      if (contact.id && contact.id.length > 10) { // Simple check for real ID
                        promises.push(updateEmergencyContactMutate({ id: contact.id, payload: contact }));
                      } else {
                        const payload: EmergencyContactPayload = {
                          ...contact,
                          userId: userId || undefined
                        };
                        promises.push(addEmergencyContact(payload));
                      }
                    }

                    await toast.promise(Promise.all(promises), {
                      loading: "Saving changes...",
                      success: "All changes saved successfully",
                      error: "Failed to save some changes",
                    });
                  } catch (error) {
                    console.error("Bulk save error:", error);
                    toast.error("An error occurred while saving");
                  }
                }}
                onDelete={async (id) => {
                  await toast.promise(deleteEmergencyContactMutate(id), {
                    loading: "Deleting contact...",
                    success: "Contact deleted successfully",
                    error: "Failed to delete contact"
                  });
                }}
              />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
