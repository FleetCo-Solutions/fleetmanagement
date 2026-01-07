import { BackendUser, UserFormData } from "@/app/types";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { useAddUser } from "../query";

interface UserFormProps {
  user: BackendUser | null;
  onSave: (userData: UserFormData & { id?: string }) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
    const {mutateAsync: AddUser} = useAddUser()
    const { control, handleSubmit, reset, formState: {errors} } = useForm({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
        }
    })

    const onSubmit = async (data: UserFormData) => {
        console.log(data)
        try {
            await toast.promise(AddUser(data),{
                loading: "Creating User...",
                success: (data) => {
                    reset(); 
                    onSave(data.dto);
                    return data.message || "User Created Successfully"
                },
                error: (error) => error.message || "Error Occured When Creating User"
            })
        }catch (error) {
            toast.error(`Error Occured: ${(error as Error).message}`)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-black mb-1">
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
                            className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
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
                    <label className="block text-sm font-medium text-black mb-1">
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
                            className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
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
                    <label className="block text-sm font-medium text-black mb-1">
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
                            className={`w-full px-3 py-2 border rounded-md focus:ring-0 outline-none text-black ${
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
                    <label className="block text-sm font-medium text-black mb-1">
                        Phone *
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                        required: "Phone number is required",
                        validate: (value) =>
                            value && value.length >= 12 ? true : "Invalid phone number",
                        }}
                        render={({ field }) => (
                        <PhoneInput
                            {...field}
                            country="tz"
                            onlyCountries={["tz"]} // Lock to Tanzania
                            enableSearch={true}
                            countryCodeEditable={false} // Prevent changing +255
                            inputStyle={{
                            width: "100%",
                            color: "black",
                            paddingLeft: "50px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            border: errors.phone ? "1px solid red" : "1px solid #d1d5db",
                            borderRadius: "0.375rem", // rounded-md
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
            <div className="flex gap-3 pt-4">
                <button
                type="submit"
                // disabled={loading}
                className="flex-1 bg-[#004953] text-white py-2 px-4 rounded-md hover:bg-[#014852] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {false ? "Saving..." : true ? "Update User" : "Create User"}
                </button>
                <button
                type="button"
                onClick={onClose}
                // disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Cancel
                </button>
            </div>
        </form>
    )

}

export default UserForm;