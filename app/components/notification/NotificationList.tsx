"use client";

import React from "react";
import NotificationItem, { Notification } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  searchQuery: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkAsRead,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004953]"></div>
        <p className="text-sm text-gray-500 font-medium">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <svg
            className="h-10 w-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-gray-900 font-semibold mb-1">
          No notifications found
        </h3>
        <p className="text-sm text-gray-500">
          {searchQuery
            ? "Try adjusting your search or filters."
            : "We'll notify you when something important happens."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;
