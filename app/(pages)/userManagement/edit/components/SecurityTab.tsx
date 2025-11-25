"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useChangePassword } from "../../query";
import { useSearchParams } from "next/navigation";

interface SecurityFormValues {
  oldPassword: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function SecurityTab() {
  const { mutateAsync: updatePassword } = useChangePassword();
  const searchParams = useSearchParams();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityFormValues>({
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (values: SecurityFormValues) => {
    try {
      console.log("Update password payload:", {...values, userId: searchParams.get("id")});
      toast.promise(
        updatePassword({
          userId: searchParams.get("id") || "",
          password: values.newPassword || "",
          oldPassword: values.oldPassword,
        }),
        {
          loading: "Updating password...",
          success: () => {
            reset();
            return "Password updated successfully!";
          },
          error: (error) => error.message || "Failed to update password",
        }
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to update password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow p-6 space-y-6"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Security Note:</strong> Password changes are critical for
          account security. Users will need to re-login after changing their
          password.
        </p>
      </div>

      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            {...register("oldPassword", {
              required: "Current password is required to change password",
            })}
            type={showCurrentPassword ? "text" : "password"}
            className={`w-full px-4 py-2 pr-12 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.oldPassword ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter your current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showCurrentPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.oldPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password (Optional)
        </label>
        <div className="relative">
          <input
            {...register("newPassword", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain uppercase, lowercase, and numbers",
              },
            })}
            type={showNewPassword ? "text" : "password"}
            className={`w-full px-4 py-2 pr-12 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.newPassword ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Leave blank to keep current password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showNewPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.newPassword.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Password must be at least 8 characters with uppercase, lowercase, and
          numbers
        </p>
      </div>

      {/* Confirm Password */}
      {newPassword && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full px-4 py-2 pr-12 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !newPassword}
          className="px-6 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Update Password"}
        </button>
      </div>

      {/* Security Features */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-600">
                Secure your account with 2FA
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-[#004953] text-white rounded-lg hover:bg-[#014852] transition-colors"
            >
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Login History</p>
              <p className="text-sm text-gray-600">
                View recent login activities
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
