"use client";

import React from "react";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-all cursor-pointer relative group ${
        !notification.isRead ? "bg-blue-50/20" : ""
      }`}
      onClick={handleClick}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004953]" />
      )}
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-gray-900 text-sm group-hover:text-[#004953] transition-colors">
          {notification.title}
        </span>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          {new Date(notification.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {notification.message}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {notification.type.split(".")[0]}
        </span>
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="text-[10px] font-bold text-[#004953] uppercase tracking-widest hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
