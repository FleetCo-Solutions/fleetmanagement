"use client";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

export type AddDriverFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  licenseNumber: string;
  licenseExpiryDate: string; // ISO date string
  emergencyContacts: {
    firstName: string;
    lastName: string;
    relationship: string;
    address: string;
    phone: string;
    email?: string;
    alternativeNo?: string;
  }[];
};

export default function AddDriverForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: AddDriverFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddDriverFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      alternativePhoneNumber: "",
      licenseNumber: "",
      licenseExpiryDate: "",
      emergencyContacts: [{ firstName: "", lastName: "", relationship: "", address: "", phone: "", email: "", alternativeNo: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black/80">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            {...register("firstName", { required: "First name is required" })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.firstName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            {...register("lastName", { required: "Last name is required" })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <Controller
            name="phoneNumber"
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
                  border: errors.phoneNumber ? "1px solid red" : "1px solid #d1d5db",
                  borderRadius: "0.375rem", // rounded-md
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Phone Number</label>
          <Controller
            name="alternativePhoneNumber"
            control={control}
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
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem", // rounded-md
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
          <input
            {...register("licenseNumber", { required: "License number is required" })}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.licenseNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter license number"
          />
          {errors.licenseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date</label>
          <input
            {...register("licenseExpiryDate", { required: "Expiry date is required" })}
            type="date"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
              errors.licenseExpiryDate ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.licenseExpiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.licenseExpiryDate.message}</p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-black">Emergency Contacts</h4>
          <button
            type="button"
            onClick={() => append({ firstName: "", lastName: "", relationship: "", address: "", phone: "", email: "", alternativeNo: "" })}
            className="text-sm text-[#004953] hover:text-[#014852] font-medium"
          >
            + Add Contact
          </button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-sm font-medium text-gray-700">Contact {index + 1}</h5>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  {...register(`emergencyContacts.${index}.firstName`, { required: "First name is required" })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.emergencyContacts?.[index]?.firstName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.emergencyContacts?.[index]?.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.firstName?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  {...register(`emergencyContacts.${index}.lastName`, { required: "Last name is required" })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.emergencyContacts?.[index]?.lastName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.emergencyContacts?.[index]?.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.lastName?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                <input
                  {...register(`emergencyContacts.${index}.relationship`, { required: "Relationship is required" })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.emergencyContacts?.[index]?.relationship ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g. spouse, parent"
                />
                {errors.emergencyContacts?.[index]?.relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.relationship?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  {...register(`emergencyContacts.${index}.address`, { required: "Address is required" })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.emergencyContacts?.[index]?.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter address"
                />
                {errors.emergencyContacts?.[index]?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.address?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <Controller
                  name={`emergencyContacts.${index}.phone`}
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
                        border: errors.emergencyContacts?.[index]?.phone ? "1px solid red" : "1px solid #d1d5db",
                        borderRadius: "0.375rem", // rounded-md
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                    />
                  )}
                />
                {errors.emergencyContacts?.[index]?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.phone?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  {...register(`emergencyContacts.${index}.email`, {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953] ${
                    errors.emergencyContacts?.[index]?.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.emergencyContacts?.[index]?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContacts[index]?.email?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Phone</label>
                <Controller
                  name={`emergencyContacts.${index}.alternativeNo`}
                  control={control}
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
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem", // rounded-md
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#004953] rounded-lg hover:bg-[#014852] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Driver"}
        </button>
      </div>
    </form>
  );
}


