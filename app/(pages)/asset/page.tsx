import React from "react";
import VehicleTableExample from "./components/vehicleTableExample";
import AddVehicleButton from "./components/AddVehicleButton";
import VehicleStats from "./components/vehicleStats";
import AssetHeaderActions from "./components/AssetHeaderActions";

const Assets = () => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-5">
        <VehicleStats />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Vehicle List</h1>
          <div className="flex gap-3">
            <AddVehicleButton />
            <AssetHeaderActions />
          </div>
        </div>
        <VehicleTableExample />
      </div>
    </div>
  );
};

export default Assets;
