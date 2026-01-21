"use client";

import React from "react";

interface NotificationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationSearch: React.FC<NotificationSearchProps> = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  unreadCount,
  onMarkAllAsRead,
}) => {
  return (
    <div className="p-4 space-y-4 border-b border-gray-100">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search notifications..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004953] focus:border-transparent transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-[#004953] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("unread")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "unread"
              ? "bg-[#004953] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unread
        </button>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="ml-auto text-xs text-[#004953] hover:underline font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationSearch;
