"use client";
import React from "react";
import { BackendUser, UserActivity } from "@/app/types";

interface ActivityTabProps {
  userData: UserActivity;
}

export default function ActivityTab({ userData }: ActivityTabProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Activity Item */}
          <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Successful Login</p>
              <p className="text-sm text-gray-600">November 17, 2025 at 10:30 AM</p>
              <p className="text-xs text-gray-500">IP: 192.168.1.100 · Chrome on Windows</p>
            </div>
          </div>

          {/* Activity Item */}
          <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Profile Updated</p>
              <p className="text-sm text-gray-600">November 16, 2025 at 2:15 PM</p>
              <p className="text-xs text-gray-500">Phone number changed</p>
            </div>
          </div>

          {/* Activity Item */}
          <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Failed Login Attempt</p>
              <p className="text-sm text-gray-600">November 15, 2025 at 11:45 PM</p>
              <p className="text-xs text-gray-500">IP: 156.23.45.67 · Unknown Browser</p>
            </div>
          </div>

          {/* Activity Item */}
          <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Account Created</p>
              <p className="text-sm text-gray-600">January 15, 2025 at 8:00 AM</p>
              <p className="text-xs text-gray-500">Account status: Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Login Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Last Login</p>
            <p className="text-lg font-medium text-gray-900">
              {userData.lastLogin
                ? new Date(userData.lastLogin).toLocaleDateString()
                : "Never"}
            </p>
            <p className="text-xs text-gray-500">
              {userData.lastLogin
                ? new Date(userData.lastLogin).toLocaleTimeString()
                : "No login record"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Account Age</p>
            <p className="text-lg font-medium text-gray-900">{userData.accountAge} days
            </p>
            <p className="text-xs text-gray-500">Since account creation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
