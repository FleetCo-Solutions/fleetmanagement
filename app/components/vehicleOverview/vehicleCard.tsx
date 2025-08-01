import React from "react";

const VehicleCard = ({
  vehiclesNo,
  description,
}: {
  vehiclesNo: string | number;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2 items-center bg-white w-full text-black py-5 rounded-lg">
      <span className="text-3xl font-bold">{vehiclesNo}</span>
      <span className="font-bold text-sm text-black/70">{description}</span>
    </div>
  );
};

export default VehicleCard;
