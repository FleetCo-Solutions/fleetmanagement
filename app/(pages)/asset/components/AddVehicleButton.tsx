"use client";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";
import VehicleForm from "./VehicleForm";

const AddVehicleButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // You can add any success handling here, like refreshing data
    console.log("Vehicle created successfully");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors"
      >
        Add Vehicle
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Add New Vehicle"
        size="3xl"
      >
        <VehicleForm
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </Modal>
    </>
  );
};

export default AddVehicleButton;



