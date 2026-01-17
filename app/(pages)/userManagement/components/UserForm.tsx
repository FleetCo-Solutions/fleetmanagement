import { BackendUser, UserFormData } from "@/app/types";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { useAddUser, useRolesQuery, useUpdateUser } from "../query";
import { useEffect } from "react";

interface UserFormProps {
  user: BackendUser | null;
  onSave: (userData: any) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const { mutateAsync: AddUser } = useAddUser();
  const { mutateAsync: UpdateUser } = useUpdateUser(user?.id || "");
  const { data: roles, isLoading: isLoadingRoles } = useRolesQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      roleIds: [] as string[],
      status: "active" as "active" | "inactive" | "suspended",
    },
  });

  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        roleIds: user.roles?.map((r: any) => r.role.id) || [],
        status: user.status || "active",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await toast.promise(UpdateUser({ id: user.id, userData: data }), {
          loading: "Updating User...",
          success: (res) => {
            onSave(res.dto);
            return res.message || "User Updated Successfully";
          },
          error: (error) =>
            error.message || "Error Occurred When Updating User",
        });
      } else {
        await toast.promise(AddUser(data), {
          loading: "Creating User...",
          success: (res) => {
            reset();
            onSave(res.dto);
            return res.message || "User Created Successfully";
          },
          error: (error) =>
            error.message || "Error Occurred When Creating User",
        });
      }
    } catch (error) {
      toast.error(`Error Occurred: ${(error as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004953] outline-none text-black ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter first name"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004953] outline-none text-black ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter last name"
              />
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email is invalid",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004953] outline-none text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
              validate: (value) =>
                value && value.length >= 10 ? true : "Invalid phone number",
            }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="tz"
                onlyCountries={["tz"]}
                enableSearch={true}
                countryCodeEditable={false}
                inputStyle={{
                  width: "100%",
                  color: "black",
                  paddingLeft: "50px",
                  height: "42px",
                  border: errors.phone ? "1px solid red" : "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Roles
        </label>
        {isLoadingRoles ? (
          <p className="text-sm text-gray-500 italic">Loading roles...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
            {roles?.map((role: any) => (
              <label
                key={role.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  value={role.id}
                  {...control.register("roleIds")}
                  className="w-4 h-4 text-[#004953] border-gray-300 rounded focus:ring-[#004953]"
                />
                <span className="text-sm text-gray-900">{role.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-lg hover:bg-[#014852] transition-colors font-medium"
        >
          {isEditMode ? "Update User" : "Create User"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
