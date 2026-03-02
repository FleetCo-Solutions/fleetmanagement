"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AddVehicleButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/asset/add")}
      className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors font-medium whitespace-nowrap"
    >
      Add Vehicle
    </button>
  );
};

export default AddVehicleButton;












