"use client";
import React from "react";
import VehicleForm from "../components/VehicleForm";
import { useRouter } from "next/navigation";

const AddVehiclePage = () => {
    const router = useRouter();

    const handleSuccess = () => {
        router.push("/asset");
    };

    const handleClose = () => {
        router.push("/asset");
    };

    return (
        <div className="bg-white w-full h-full flex flex-col overflow-hidden">
            <VehicleForm
                onClose={handleClose}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default AddVehiclePage;
