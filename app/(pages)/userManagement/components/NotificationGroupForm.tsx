"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  useCreateNotificationGroup,
  useUpdateNotificationGroup,
  useUserQuery,
  useNotificationTopicsQuery,
} from "../query";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  topicIds: z.array(z.string()).min(1, "Select at least one topic"),
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
  const { data: topicsData, isLoading: isLoadingTopics } =
    useNotificationTopicsQuery();

  const users = userData?.dto?.content || [];
  const topics = topicsData?.success ? topicsData.data : [];

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
      topicIds: [],
      userIds: [],
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (group) {
      reset({
        name: group.name || "",
        description: group.description || "",
        topicIds:
          group.topicSubscriptions?.map((sub: any) => sub.topicId) || [],
        userIds: group.users?.map((u: any) => u.userId) || [],
      });
    }
  }, [group, reset]);

  const selectedTopicIds = watch("topicIds") || [];
  const selectedUserIds = watch("userIds") || [];

  const handleTopicToggle = (topicId: string) => {
    const current = selectedTopicIds;
    if (current.includes(topicId)) {
      setValue(
        "topicIds",
        current.filter((id) => id !== topicId),
      );
    } else {
      setValue("topicIds", [...current, topicId]);
    }
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

      {/* Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subscribe to Topics
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          {isLoadingTopics && (
            <p className="text-sm text-gray-400 p-2 col-span-2 text-center">
              Loading topics...
            </p>
          )}
          {topics?.map((topic: any) => {
            const isSelected = selectedTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                onClick={() => handleTopicToggle(topic.id)}
                className={`p-3 rounded-md border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#004953]/10 border-[#004953]/30 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#004953] border-[#004953]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-bold text-xs uppercase tracking-tight">
                      {topic.name}
                    </div>
                    {topic.description && (
                      <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                        {topic.description}
                      </div>
                    )}
                    <div className="flex gap-1 mt-1.5">
                      {topic.defaultChannels?.map((ch: string) => (
                        <span
                          key={ch}
                          className="px-1.5 py-0.5 bg-gray-100 text-[9px] text-gray-600 rounded-sm font-medium uppercase"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors.topicIds && (
          <p className="text-red-500 text-xs mt-1">{errors.topicIds.message}</p>
        )}
      </div>

      {/* Users Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Users
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 p-2 col-span-2 text-center">
              Loading users...
            </p>
          )}
          {(users as any[]).map((user: any) => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <div
                key={user.id}
                onClick={() => handleUserToggle(user.id)}
                className={`flex items-center space-x-2 p-2 rounded-md border text-sm cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#004953]/10 border-[#004953]/30 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#004953] border-[#004953]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-800 font-bold text-xs truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-gray-500 text-[10px] truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            );
          })}
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
          className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#003d46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md shadow-[#004953]/20"
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
