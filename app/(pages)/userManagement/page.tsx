"use client";
import React, { useState } from "react";
import UsersTab from "./components/UsersTab";
import RolesTab from "./components/RolesTab";
import NotificationsTab from "./components/NotificationsTab";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users", icon: "👥" },
    { id: "roles", label: "Roles", icon: "🔐" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        {/* Tabs */}
        <div className="bg-white border border-black/20 rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#004953] text-[#004953]"
                      : "border-transparent text-black/60 hover:text-black hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "roles" && <RolesTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
