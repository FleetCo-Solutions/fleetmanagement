import React from "react";

const OverviewSkeleton = () => (
  <div className="group w-full">
    <div className="group-hover:bg-[#014852] text-black group-hover:text-white text-xl font-bold p-5 rounded-xl w-full flex flex-col gap-5 border-[1px] border-black/20 cursor-pointer ">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div>
        <div className="flex flex-col">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default OverviewSkeleton;
