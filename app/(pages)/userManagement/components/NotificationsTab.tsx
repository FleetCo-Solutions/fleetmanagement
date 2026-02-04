"use client";

import React, { useState } from "react";
import UniversalTable from "@/app/components/universalTable";
import UniversalTableSkeleton from "@/app/components/universalTableSkeleton";
import { useNotificationGroupsQuery } from "../query";
import { ColumnDef } from "@tanstack/react-table";
import Modal from "@/app/components/Modal";
import NotificationGroupForm from "./NotificationGroupForm";

export default function NotificationsTab() {
  const { data, isLoading } = useNotificationGroupsQuery();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  const columns: ColumnDef<any>[] = [
    {
      header: "Group Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      header: "Subscribed Topics",
      accessorKey: "types",
      cell: ({ row }) => {
        const emailCount =
          row.original.types?.filter((t: any) => t.sendEmail).length || 0;
        const totalCount = row.original.types?.length || 0;

        return (
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
              {totalCount} Topics
            </span>
            {emailCount > 0 && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {emailCount} Email
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Members",
      accessorKey: "users",
      cell: ({ row }) => (
        <div className="flex -space-x-2">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
            {row.original.users?.length || 0} Users
          </span>
        </div>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span className="text-gray-500">
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => setEditingGroup(row.original)}
          className="text-[#004953] hover:underline text-sm font-medium"
        >
          Edit
        </button>
      ),
    },
  ];

  // Data processing - ensure groups is always an array
  const groups = (data?.success ? data.data : []) || [];

  return (
    <div className="bg-white border boundary border-black/10 rounded-xl shadow-sm h-full flex flex-col">
      {isLoading ? (
        <div className="p-6">
          <UniversalTableSkeleton />
        </div>
      ) : (
        <>
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Notification Groups
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage notification subscriptions and email delivery
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#003d46] transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Group
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <UniversalTable columns={columns} data={groups} />
          </div>
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Notification Group"
        size="2xl"
      >
        <div className="p-4">
          <NotificationGroupForm
            onClose={() => setShowCreateModal(false)}
            onSave={() => setShowCreateModal(false)}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        title="Edit Notification Group"
        size="2xl"
      >
        <div className="p-4">
          <NotificationGroupForm
            group={editingGroup}
            onClose={() => setEditingGroup(null)}
            onSave={() => setEditingGroup(null)}
          />
        </div>
      </Modal>
    </div>
  );
}
