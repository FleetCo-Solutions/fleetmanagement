"use client";
import { useParams } from "next/navigation";
import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import UniversalTable from "@/app/components/universalTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import useDriverDetailsQuery from "./query";

export default function DriverProfile() {
  const params = useParams();
  const driverId = params.id as string;
  const {data: driver} = useDriverDetailsQuery({id: driverId});

  // Mock recent trips for the driver
  const recentTrips = [
    {
      date: "2024-06-01",
      vehicle: driver?.assignedVehicle || "-",
      origin: "Dar es Salaam",
      destination: "Arusha",
      distance: 600,
      violations: 0,
      fuelUsed: 50,
    },
    {
      date: "2024-05-28",
      vehicle: driver?.assignedVehicle || "-",
      origin: "Arusha",
      destination: "Mwanza",
      distance: 800,
      violations: 1,
      fuelUsed: 70,
    },
  ];

  interface Trip {
    date: string;
    vehicle: string;
    origin: string;
    destination: string;
    distance: number;
    violations: number;
    fuelUsed: number;
  }

  const tripColumns: ColumnDef<Trip>[] = [
    { header: "Date", accessorKey: "date" },
    { header: "Vehicle", accessorKey: "vehicle" },
    { header: "Origin", accessorKey: "origin" },
    { header: "Destination", accessorKey: "destination" },
    { header: "Distance (km)", accessorKey: "distance" },
    { header: "Violations", accessorKey: "violations" },
    { header: "Fuel Used (L)", accessorKey: "fuelUsed" },
  ];

  if (!driver) {
    return <div className="p-10 text-xl text-red-600">Driver not found.</div>;
  }

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#004953] p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">{driver.firstName} {driver.lastName}</h1>
              <p className="text-black/60">{driver.email} &bull; {driver.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors">Edit Driver</button>
            <button className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">Delete Driver</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6">
          <OverviewRealTime title="Total Trips" quantity={driver.totalTrips} description="All time" />
          <OverviewRealTime title="Safety Score" quantity={driver.safetyScore + '%'} description="Last 12 months" />
          <OverviewRealTime title="Violations" quantity={driver.violations} description="Last 12 months" />
          <OverviewRealTime title="Fuel Efficiency" quantity={driver.fuelEfficiencyRating} description="km/L" />
        </div>

        {/* Personal & License Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Personal Information</h2>
            <div className="space-y-2 text-black/60">
              <div><span className="font-semibold">Name:</span> {driver.firstName} {driver.lastName}</div>
              <div><span className="font-semibold">Date of Birth:</span> {driver.dateOfBirth}</div>
              <div><span className="font-semibold">Status:</span> {driver.status}</div>
              <div><span className="font-semibold">Address:</span> {driver.address.street}, {driver.address.city}, {driver.address.postalCode}</div>
              <div><span className="font-semibold">Emergency Contact:</span> {driver.emergencyContact.name} ({driver.emergencyContact.relationship}) - {driver.emergencyContact.phone}</div>
            </div>
          </div>
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">License & Assignment</h2>
            <div className="space-y-2 text-black/60">
              <div><span className="font-semibold">License Number:</span> {driver.licenseNumber}</div>
              <div><span className="font-semibold">License Expiry:</span> {driver.licenseExpiry}</div>
              <div><span className="font-semibold">Medical Cert Expiry:</span> {driver.medicalCertExpiry}</div>
              <div><span className="font-semibold">Training Cert Expiry:</span> {driver.trainingCertExpiry}</div>
              <div><span className="font-semibold">Assigned Vehicle:</span> {driver.assignedVehicle || "-"}</div>
              <div><span className="font-semibold">Hire Date:</span> {driver.hireDate}</div>
            </div>
          </div>
        </div>

        {/* Recent Trips Table */}
        <div className="border-[1px] border-black/20 rounded-xl flex flex-col gap-5 p-5 bg-white ">
          <span className="text-2xl font-semibold text-black ">Recent Trips</span>
          <UniversalTable data={recentTrips} columns={tripColumns} showSearch={false} showPagination={false} />
        </div>
      </div>
    </div>
  );
} 