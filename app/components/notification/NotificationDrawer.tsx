"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNotificationsQuery, useMarkAsReadMutation } from "./query";
import NotificationList from "./NotificationList";
import NotificationSearch from "./NotificationSearch";
import { Notification } from "./NotificationItem";

const NotificationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData, isLoading } = useNotificationsQuery();
  const markAsReadMutation = useMarkAsReadMutation();

  const notifications: Notification[] = notificationsData?.data || [];

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || !n.isRead;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right Drawer - Increased size to 500px */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                {unreadCount} unread messages
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search & Filters */}
          <NotificationSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            unreadCount={unreadCount}
            onMarkAllAsRead={() => markAsReadMutation.mutate(undefined)}
          />

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <NotificationList
              notifications={filteredNotifications}
              isLoading={isLoading}
              onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
              searchQuery={searchQuery}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              Notification Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
