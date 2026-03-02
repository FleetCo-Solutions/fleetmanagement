"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAddVehicle, useDriversListQuery } from "../query";
import { IPostVehicle } from "@/app/api/vehicles/post";
import { useHeaderActions } from "@/app/context/HeaderActionsContext";
import { useRouter } from "next/navigation";

interface VehicleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onSuccess }) => {
  const { mutateAsync: submitVehicle, isPending: loading } = useAddVehicle();
  const { data: driversList } = useDriversListQuery();
  const [activeTab, setActiveTab] = useState("Asset details");

  // Access control state
  const [accessMode, setAccessMode] = useState<"all" | "select">("all");
  const [selectedDriverIds, setSelectedDriverIds] = useState<Set<string>>(new Set());
  const [hasDefaultDriver, setHasDefaultDriver] = useState(false);
  const [defaultDriverId, setDefaultDriverId] = useState("");
  const [driverSearch, setDriverSearch] = useState("");

  const { setHeaderActions, setTitleOverride, setStatusBadge, setSubTabs, setHideGlobalActions } = useHeaderActions();
  const router = useRouter();

  const tabs = [
    { id: "Asset details", label: "Asset details", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: "Asset status", label: "Asset status", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "Access control", label: "Access control", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { id: "Custom groups", label: "Custom groups", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "Service history", label: "Service history", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "Reminders", label: "Reminders", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "Fuel data", label: "Fuel data", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "Other cost data", label: "Other cost data", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "Mobile device", label: "Mobile device", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IPostVehicle>({
    defaultValues: {
      vehicleRegNo: "",
      model: "",
      manufacturer: "",
      vin: "",
      color: "",
      description: "",
      engineNumber: "",
      fuelType: "",
      year: "",
      tankCapacity: undefined,
      targetConsumption: undefined,
      inServiceDate: new Date().toISOString().split("T")[0],
      inServiceOdometer: undefined,
      estimatedServiceLifeMonths: "",
      estimatedServiceLifeMeter: undefined,
      estimatedResaleValue: undefined,
      outOfServiceDate: new Date().toISOString().split("T")[0],
      outOfServiceOdometer: undefined,
      imei: "",
      simCardNumber: "",
      status: "Available",
      expiryType: "Never",
      expiryDate: "",
    },
    mode: "onChange",
  });

  const regNo = watch("vehicleRegNo");
  const description = watch("description");
  const currentStatus = watch("status");

  const onSubmit = async (data: IPostVehicle) => {
    try {
      const cleanedData: IPostVehicle = {
        ...data,
        vehicleRegNo: data.vehicleRegNo.trim(),
        model: data.model.trim(),
        manufacturer: data.manufacturer.trim(),
        vin: data.vin.trim(),
        color: data.color.trim(),
        description: data.description?.trim(),
        engineNumber: data.engineNumber?.trim(),
        fuelType: data.fuelType?.trim(),
        year: data.year?.trim(),
        tankCapacity: data.tankCapacity ? Number(data.tankCapacity) : undefined,
        targetConsumption: data.targetConsumption ? Number(data.targetConsumption) : undefined,
        inServiceDate: data.inServiceDate,
        inServiceOdometer: data.inServiceOdometer ? Number(data.inServiceOdometer) : undefined,
        estimatedServiceLifeMonths: data.estimatedServiceLifeMonths?.trim(),
        estimatedServiceLifeMeter: data.estimatedServiceLifeMeter ? Number(data.estimatedServiceLifeMeter) : undefined,
        estimatedResaleValue: data.estimatedResaleValue ? Number(data.estimatedResaleValue) : undefined,
        outOfServiceDate: data.outOfServiceDate,
        outOfServiceOdometer: data.outOfServiceOdometer ? Number(data.outOfServiceOdometer) : undefined,
        imei: data.imei?.trim(),
        simCardNumber: data.simCardNumber?.trim(),
        status: data.status?.trim(),
        expiryType: data.expiryType,
        expiryDate: data.expiryType === "Specific Date" ? data.expiryDate : undefined,
      };

      await toast.promise(submitVehicle(cleanedData), {
        loading: "Adding Vehicle...",
        success: (result) => {
          onSuccess();
          reset();
          return result.message || "Vehicle Added Successfully";
        },
        error: (err) => {
          return err instanceof Error ? err.message : "An Error Occurred";
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An Error Occurred");
    }
  };

  React.useEffect(() => {
    const title = regNo || description ? `${description} ${regNo ? `(${regNo})` : ""}` : "Add New Asset";
    setTitleOverride(title);

    const getStatusColor = (status: string) => {
      switch (status) {
        case "New installation": return "bg-blue-500";
        case "Available": return "bg-emerald-600";
        case "Unavailable": return "bg-rose-600";
        case "Under maintenance(Workshop)": return "bg-amber-500";
        case "Deinstalled": return "bg-slate-500";
        case "Sold": return "bg-zinc-900";
        case "Accident": return "bg-red-700";
        case "Operational - not downloading": return "bg-fuchsia-600";
        default: return "bg-sky-500";
      }
    };

    setStatusBadge(
      <span className={`px-4 py-1.5 ${getStatusColor(currentStatus)} text-white text-[10px] uppercase tracking-widest font-black rounded-full shadow-sm transition-all duration-300 animate-in fade-in zoom-in-95`}>
        {currentStatus}
      </span>
    );

    setSubTabs(
      <div className="flex items-center gap-8 h-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-full px-1 border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab.id
              ? "border-[#004953] text-[#004953] font-bold"
              : "border-transparent text-gray-400 hover:text-[#004953] hover:border-gray-200"
              }`}
          >
            <span className="text-sm tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    );

    setHeaderActions(
      <>
        <button
          onClick={() => {
            const form = document.getElementById("asset-form") as HTMLFormElement;
            if (form) form.requestSubmit();
          }}
          type="button"
          disabled={loading}
          className="px-8 py-2 bg-[#004953c0] text-white font-medium rounded-lg hover:bg-[#004953] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </>
    );

    setHideGlobalActions(true);

    return () => {
      setHeaderActions(null);
      setTitleOverride(null);
      setStatusBadge(null);
      setSubTabs(null);
      setHideGlobalActions(false);
    };
  }, [regNo, description, currentStatus, loading, setHeaderActions, setTitleOverride, setStatusBadge, setSubTabs, setHideGlobalActions, activeTab, onClose]);

  return (
    <div className="flex w-full h-full bg-[#fcfdfd] text-black">
      <div className="flex w-full h-full overflow-hidden">
        {/* Form Content Area */}
        <div className="flex-1 p-10 overflow-y-auto bg-gray-50/30">
          {activeTab === "Asset details" ? (
            <form id="asset-form" onSubmit={handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Card 1: General Information - Full Width */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">General Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Asset description <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g., COASTER T671DRV"
                          />
                        )}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Asset type <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all">
                        <option>Light Passenger Vehicle - Minibus</option>
                        <option>Heavy Truck</option>
                        <option>SUV</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Site <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all">
                        <option>COATING</option>
                        <option>HEAD OFFICE</option>
                        <option>DEPOT A</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Configuration group
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all">
                        <option>HV_FMB920_GPS_No RPM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Country
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all">
                        <option>Tanzania, United Republic of</option>
                        <option>Kenya</option>
                        <option>Uganda</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
                          <Controller
                            name="fuelType"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all">
                                <option value="">Select Fuel Type</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Tank Capacity (L)</label>
                          <Controller
                            name="tankCapacity"
                            control={control}
                            render={({ field }) => (
                              <input {...field} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all text-center font-bold" placeholder="0" />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Target (l/100km)</label>
                          <Controller
                            name="targetConsumption"
                            control={control}
                            render={({ field }) => (
                              <input {...field} type="number" step="0.1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all text-center font-bold" placeholder="0.0" />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Identity & Specifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">Identity & Specifications</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Registration number <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="vehicleRegNo"
                        control={control}
                        rules={{ required: "Registration number is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="T671DRV"
                          />
                        )}
                      />
                      {errors.vehicleRegNo && <p className="text-red-500 text-xs mt-1 font-medium">{errors.vehicleRegNo.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Fleet number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                        placeholder="001179856/"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Vehicle Identification Number (VIN) <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="vin"
                        control={control}
                        rules={{
                          required: "VIN is required",
                          validate: (v) => v?.length === 17 || "VIN must be 17 characters"
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            maxLength={17}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all font-mono"
                          />
                        )}
                      />
                      {errors.vin && <p className="text-red-500 text-xs mt-1 font-medium">{errors.vin.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="manufacturer"
                        control={control}
                        rules={{ required: "Make is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="Toyota"
                          />
                        )}
                      />
                      {errors.manufacturer && <p className="text-red-500 text-xs mt-1 font-medium">{errors.manufacturer.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="model"
                        control={control}
                        rules={{ required: "Model is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="Coaster"
                          />
                        )}
                      />
                      {errors.model && <p className="text-red-500 text-xs mt-1 font-medium">{errors.model.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Engine Number
                      </label>
                      <Controller
                        name="engineNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Year
                      </label>
                      <Controller
                        name="year"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="2024"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Color <span className="text-red-500">*</span></label>
                      <Controller
                        name="color"
                        control={control}
                        rules={{ required: "Color is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="White"
                          />
                        )}
                      />
                      {errors.color && <p className="text-red-500 text-xs mt-1 font-medium">{errors.color.message}</p>}
                    </div>
                  </div>
                </div>


              </div>
            </form>
          ) : activeTab === "Asset status" ? (
            <form id="asset-form" onSubmit={handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Card 1: Current Status */}
                <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">Current Status</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Asset Status <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all font-bold text-[#004953]"
                          >
                            <option value="New installation">New installation</option>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Under maintenance(Workshop)">Under maintenance(Workshop)</option>
                            <option value="Deinstalled">Deinstalled</option>
                            <option value="Sold">Sold</option>
                            <option value="Accident">Accident</option>
                            <option value="Operational - not downloading">Operational - not downloading</option>
                          </select>
                        )}
                      />
                    </div>
                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-sky-800 font-medium">
                        Selecting the correct status ensures accurate reporting for maintenance and availability schedules.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 1.5: Expiry Configuration */}
                <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">
                      Expiry Configuration for <span className="text-[#004953] italic">&quot;{watch("status")}&quot;</span> status
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-gray-700">When should this status expire?</label>
                      <Controller
                        name="expiryType"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => field.onChange("Never")}
                              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm flex items-center justify-center gap-2 ${field.value === "Never"
                                ? "border-[#004953] bg-[#004953]/5 text-[#004953]"
                                : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === "Never" ? "border-[#004953]" : "border-gray-300"}`}>
                                {field.value === "Never" && <div className="w-2 h-2 bg-[#004953] rounded-full" />}
                              </div>
                              Never
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("Specific Date")}
                              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm flex items-center justify-center gap-2 ${field.value === "Specific Date"
                                ? "border-[#004953] bg-[#004953]/5 text-[#004953]"
                                : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === "Specific Date" ? "border-[#004953]" : "border-gray-300"}`}>
                                {field.value === "Specific Date" && <div className="w-2 h-2 bg-[#004953] rounded-full" />}
                              </div>
                              On specified date
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-gray-700">Expiry Date</label>
                      <Controller
                        name="expiryDate"
                        control={control}
                        render={({ field }) => {
                          const expiryType = watch("expiryType");
                          const isDisabled = expiryType === "Never";
                          return (
                            <div className="relative group">
                              <div className={`absolute left-4 inset-y-0 flex items-center pointer-events-none transition-colors ${isDisabled ? "text-gray-300" : "text-[#004953] group-focus-within:text-[#004953]"}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                type="date"
                                disabled={isDisabled}
                                className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all font-bold appearance-none ${isDisabled
                                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#004953] focus:border-transparent focus:bg-white text-[#004953] hover:border-gray-300 cursor-pointer"
                                  }`}
                              />
                              {isDisabled && (
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-200/50 px-2 py-1 rounded-md">Permanent {watch("status")}</span>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                      <p className="text-[10px] text-gray-400 font-medium">Specify the exact date when the <span className="text-[#004953] font-bold">&quot;{watch("status")}&quot;</span> status should transition or be reviewed.</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Lifecycle */}
                <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">Lifecycle</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                    {/* In-Service Section */}
                    <div className="space-y-6 md:col-span-2 lg:col-span-1">
                      <h3 className="text-sm font-bold text-[#004953] border-b border-gray-100 pb-2">In-Service</h3>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">In-Service Date</label>
                        <Controller
                          name="inServiceDate"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Date vehicle entered active fleet service</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">In-Service Odometer</label>
                        <Controller
                          name="inServiceOdometer"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" placeholder="0" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Odometer reading on in-service date</p>
                      </div>
                    </div>

                    {/* Estimates Section */}
                    <div className="space-y-6 md:col-span-2 lg:col-span-1 border-x border-gray-50 px-0 lg:px-10">
                      <h3 className="text-sm font-bold text-[#004953] border-b border-gray-100 pb-2">Vehicle Life Estimates</h3>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Est. Service Life (Months)</label>
                        <Controller
                          name="estimatedServiceLifeMonths"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" placeholder="e.g. 60" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Months expected in active fleet service</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Est. Service Life (Meter)</label>
                        <Controller
                          name="estimatedServiceLifeMeter"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" placeholder="0" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Expected meter value before retiring</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Est. Resale Value ($)</label>
                        <Controller
                          name="estimatedResaleValue"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" placeholder="0.00" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Expected amount after retirement/sale</p>
                      </div>
                    </div>

                    {/* Out-of-Service Section */}
                    <div className="space-y-6 md:col-span-2 lg:col-span-1">
                      <h3 className="text-sm font-bold text-[#004953] border-b border-gray-100 pb-2">Out-of-Service</h3>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Out-of-Service Date</label>
                        <Controller
                          name="outOfServiceDate"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Date vehicle was retired from fleet service</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Out-of-Service Odometer</label>
                        <Controller
                          name="outOfServiceOdometer"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all" placeholder="0" />
                          )}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Final odometer reading on out-of-service date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : activeTab === "Mobile device" ? (
            <form id="asset-form" onSubmit={handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 bg-[#004953] rounded-full" />
                    <h2 className="text-lg font-bold text-gray-800">Mobile Device Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        IMEI Number
                      </label>
                      <Controller
                        name="imei"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="Enter 15-digit IMEI"
                            maxLength={15}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        SIM Card Number
                      </label>
                      <Controller
                        name="simCardNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004953] focus:bg-white outline-none transition-all"
                            placeholder="Enter SIM ID"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#004953]/5 rounded-2xl border border-[#004953]/10 p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-16 h-16 bg-[#004953]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#004953]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-[#004953] font-bold text-lg mb-2">Device Connectivity</h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    Ensure the device information matches the physical tracking hardware installed in the vehicle for proper telematics synchronization.
                  </p>
                </div>
              </div>
            </form>
          ) : activeTab === "Access control" ? (
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">

              {/* Header Summary Bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Access Control</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {accessMode === "all" ? (
                        <span className="font-bold text-emerald-600">{driversList?.dto?.length ?? 0} drivers allowed</span>
                      ) : (
                        <span className="font-bold text-[#004953]">{selectedDriverIds.size} drivers allowed</span>
                      )}
                      {" "}<span className="text-gray-400">·</span>{" "}
                      <span>{driversList?.dto?.length ?? 0} total drivers</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                    <svg className="w-4 h-4 text-[#004953]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Manage who can operate this vehicle
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* LEFT: Access Mode + Driver List */}
                <div className="xl:col-span-2 space-y-6">

                  {/* Mode Toggle */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5">Access Mode</h3>
                    <div className="space-y-3">

                      {/* All mode */}
                      <button
                        type="button"
                        onClick={() => setAccessMode("all")}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${accessMode === "all"
                          ? "border-[#004953] bg-[#004953]/5"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50"
                          }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${accessMode === "all" ? "border-[#004953]" : "border-gray-300"
                          }`}>
                          {accessMode === "all" && <div className="w-2.5 h-2.5 bg-[#004953] rounded-full" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${accessMode === "all" ? "text-[#004953]" : "text-gray-700"}`}>
                            All new drivers (in this organisation) may operate this asset
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Any driver added to the organisation automatically has access</p>
                        </div>
                      </button>

                      {/* Select mode */}
                      <button
                        type="button"
                        onClick={() => setAccessMode("select")}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${accessMode === "select"
                          ? "border-[#004953] bg-[#004953]/5"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50"
                          }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${accessMode === "select" ? "border-[#004953]" : "border-gray-300"
                          }`}>
                          {accessMode === "select" && <div className="w-2.5 h-2.5 bg-[#004953] rounded-full" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${accessMode === "select" ? "text-[#004953]" : "text-gray-700"}`}>
                            Select drivers who may operate this asset
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Only the drivers you specifically choose can operate this vehicle</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Driver List (only in select mode) */}
                  {accessMode === "select" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select Drivers</h3>
                          {selectedDriverIds.size > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedDriverIds(new Set())}
                              className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        {/* Search */}
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={driverSearch}
                            onChange={(e) => setDriverSearch(e.target.value)}
                            placeholder="Search drivers..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#004953] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                        {driversList?.dto
                          ?.filter(d =>
                            `${d.firstName} ${d.lastName}`.toLowerCase().includes(driverSearch.toLowerCase()) ||
                            d.licenseNumber?.toLowerCase().includes(driverSearch.toLowerCase())
                          )
                          .map(driver => {
                            const isSelected = selectedDriverIds.has(driver.id);
                            return (
                              <button
                                key={driver.id}
                                type="button"
                                onClick={() => {
                                  const next = new Set(selectedDriverIds);
                                  if (isSelected) { next.delete(driver.id); } else { next.add(driver.id); }
                                  setSelectedDriverIds(next);
                                }}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${isSelected ? "bg-[#004953]/5" : "hover:bg-gray-50"
                                  }`}
                              >
                                {/* Checkbox */}
                                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? "border-[#004953] bg-[#004953]" : "border-gray-300 bg-white"
                                  }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${isSelected ? "bg-[#004953] text-white" : "bg-gray-100 text-gray-600"
                                  }`}>
                                  {driver.firstName[0]}{driver.lastName[0]}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold truncate ${isSelected ? "text-[#004953]" : "text-gray-900"}`}>
                                    {driver.firstName} {driver.lastName}
                                  </p>
                                  {driver.licenseNumber && (
                                    <p className="text-xs text-gray-400 font-medium">{driver.licenseNumber}</p>
                                  )}
                                </div>
                                {/* Status badge */}
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${driver.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                                  }`}>
                                  {driver.status}
                                </span>
                              </button>
                            );
                          })}

                        {!driversList?.dto?.length && (
                          <div className="py-12 text-center text-gray-400">
                            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm font-medium">No drivers found in this organisation</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: Default Driver */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">Default Driver</h3>
                    </div>

                    {/* Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setHasDefaultDriver(!hasDefaultDriver);
                        if (hasDefaultDriver) setDefaultDriverId("");
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${hasDefaultDriver ? "border-[#004953] bg-[#004953]/5" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${hasDefaultDriver ? "border-[#004953] bg-[#004953]" : "border-gray-300 bg-white"
                        }`}>
                        {hasDefaultDriver && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${hasDefaultDriver ? "text-[#004953]" : "text-gray-700"}`}>
                          Asset has a default driver
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Automatically assign a primary driver</p>
                      </div>
                    </button>

                    {/* Dropdown */}
                    {hasDefaultDriver && (
                      <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Default driver name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={defaultDriverId}
                            onChange={(e) => setDefaultDriverId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#004953] focus:border-transparent outline-none transition-all appearance-none font-medium"
                          >
                            <option value="">Select default driver</option>
                            {driversList?.dto?.map(driver => (
                              <option key={driver.id} value={driver.id}>
                                {driver.firstName} {driver.lastName}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {defaultDriverId && (() => {
                          const d = driversList?.dto?.find(dr => dr.id === defaultDriverId);
                          if (!d) return null;
                          return (
                            <div className="mt-3 flex items-center gap-3 p-3 bg-[#004953]/5 rounded-xl border border-[#004953]/10">
                              <div className="w-9 h-9 rounded-full bg-[#004953] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {d.firstName[0]}{d.lastName[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#004953]">{d.firstName} {d.lastName}</p>
                                {d.licenseNumber && <p className="text-xs text-gray-500">{d.licenseNumber}</p>}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Info card */}
                  <div className="bg-sky-50 rounded-2xl border border-sky-100 p-5">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-sky-700 font-medium leading-relaxed">
                        Access control settings determine which drivers in your organisation are permitted to operate this vehicle. The default driver will be pre-assigned when scheduling trips.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="p-6 bg-gray-50 rounded-full border-2 border-gray-100 shadow-inner">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400 mb-2">Under Construction</p>
                <p className="text-gray-400">Content for &quot;{activeTab}&quot; will be available soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
