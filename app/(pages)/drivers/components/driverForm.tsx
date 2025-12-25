"use client";
import React from "react";
import AddDriverForm from "./AddDriverForm";
import { Driver } from "@/app/types";

const DriverForm: React.FC<{
  onCancel: () => void;
  initialValues?: Driver | null;
}> = ({ onCancel, initialValues }) => {
  return (
    <div className="w-full text-black">
      <AddDriverForm
        onCancel={onCancel}
        initialValues={initialValues ?? undefined}
      />
    </div>
  );
};

export default DriverForm;
