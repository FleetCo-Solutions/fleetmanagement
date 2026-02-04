"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  useCreateNotificationGroup,
  useUpdateNotificationGroup,
  useUserQuery,
} from "../query";
import { toast } from "sonner";

const NOTIFICATION_TYPES = [
  { value: "trip.assigned", label: "Trip Assigned" },
  { value: "trip.started", label: "Trip Started" },
  { value: "trip.completed", label: "Trip Completed" },
  { value: "trip.cancelled", label: "Trip Cancelled" },
  { value: "maintenance.due", label: "Maintenance Due" },
  { value: "maintenance.overdue", label: "Maintenance Overdue" },
  { value: "document.expiry", label: "Document Expiry" },
  { value: "violation.overspeed", label: "Speed Violation" },
  { value: "violation.geofence", label: "Geofence Violation" },
];

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  types: z
    .array(
      z.object({
        type: z.string(),
        sendEmail: z.boolean(),
      }),
    )
    .min(1, "Select at least one topic"),
  userIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface NotificationGroupFormProps {
  onClose: () => void;
  onSave?: () => void;
  group?: any; // Existing group for edit mode
}

export default function NotificationGroupForm({
  onClose,
  onSave,
  group,
}: NotificationGroupFormProps) {
  const { mutateAsync: createGroup, isPending: isCreating } =
    useCreateNotificationGroup();
  const { mutateAsync: updateGroup, isPending: isUpdating } =
    useUpdateNotificationGroup();
  const { data: userData } = useUserQuery();
  const users = userData?.dto?.content || [];

  const isEditMode = !!group;
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: async (values) => {
      try {
        const data = schema.parse(values);
        return {
          values: data,
          errors: {},
        };
      } catch (error: any) {
        return {
          values: {},
          errors: error.issues.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path.join(".")]: {
                type: currentError.code,
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    defaultValues: {
      name: "",
      description: "",
      types: [],
      userIds: [],
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (group) {
      reset({
        name: group.name || "",
        description: group.description || "",
        types:
          group.types?.map((t: any) => ({
            type: t.type,
            sendEmail: t.sendEmail || false,
          })) || [],
        userIds: group.users?.map((u: any) => u.userId) || [],
      });
    }
  }, [group, reset]);

  const selectedTypes = watch("types") || [];
  const selectedUserIds = watch("userIds") || [];

  const handleTypeToggle = (typeValue: string) => {
    const current = selectedTypes;
    const exists = current.find((t) => t.type === typeValue);

    if (exists) {
      // Remove type
      setValue(
        "types",
        current.filter((t) => t.type !== typeValue),
      );
    } else {
      // Add type with default sendEmail = false
      setValue("types", [...current, { type: typeValue, sendEmail: false }]);
    }
  };

  const handleEmailToggle = (typeValue: string) => {
    const current = selectedTypes;
    const updated = current.map((t) =>
      t.type === typeValue ? { ...t, sendEmail: !t.sendEmail } : t,
    );
    setValue("types", updated);
  };

  const handleUserToggle = (userId: string) => {
    const current = selectedUserIds;
    if (current.includes(userId)) {
      setValue(
        "userIds",
        current.filter((id) => id !== userId),
      );
    } else {
      setValue("userIds", [...current, userId]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode) {
        const res = await updateGroup({ groupId: group.id, data });
        if (res.success) {
          toast.success("Notification Group updated successfully");
          if (onSave) onSave();
          onClose();
        } else {
          toast.error(res.error || "Failed to update group");
        }
      } else {
        const res = await createGroup(data);
        if (res.success) {
          toast.success("Notification Group created successfully");
          if (onSave) onSave();
          onClose();
        } else {
          toast.error(res.error || "Failed to create group");
        }
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953]/20 focus:border-[#004953] transition-all bg-white text-black"
          placeholder="e.g. Safety Team"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953]/20 focus:border-[#004953] transition-all bg-white text-black h-20 resize-none"
          placeholder="Describe who is in this group..."
        />
      </div>

      {/* Topics with Email Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subscribe to Topics
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          {NOTIFICATION_TYPES.map((type) => {
            const selectedType = selectedTypes.find(
              (t) => t.type === type.value,
            );
            const isSelected = !!selectedType;
            const emailEnabled = selectedType?.sendEmail || false;

            return (
              <div
                key={type.value}
                className={`p-3 rounded-md border transition-colors ${
                  isSelected
                    ? "bg-[#004953]/10 border-[#004953]/30"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTypeToggle(type.value)}
                      className="rounded border-gray-300 text-[#004953] focus:ring-[#004953]"
                    />
                    <span className="text-gray-700 font-medium">
                      {type.label}
                    </span>
                  </label>

                  {/* Email Toggle - Only show when topic is selected */}
                  {isSelected && (
                    <label className="flex items-center space-x-2 cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={() => handleEmailToggle(type.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                        Send Email
                      </span>
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {errors.types && (
          <p className="text-red-500 text-xs mt-1">{errors.types.message}</p>
        )}
      </div>

      {/* Users Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Users
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 p-2">Loading users...</p>
          )}
          {(users as any[]).map((user: any) => (
            <label
              key={user.id}
              className={`flex items-center space-x-2 p-2 rounded-md border text-sm cursor-pointer transition-colors ${
                selectedUserIds.includes(user.id)
                  ? "bg-[#004953]/10 border-[#004953]/30"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                value={user.id}
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleUserToggle(user.id)}
                className="rounded border-gray-300 text-[#004953] focus:ring-[#004953]"
              />
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-gray-500 text-xs">{user.email}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#003d46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Group"
              : "Create Group"}
        </button>
      </div>
    </form>
  );
}
