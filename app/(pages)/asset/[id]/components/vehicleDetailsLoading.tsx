import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";
import React from "react";

const vehicleDetailsLoading = () => {
  return (
    <div className="p-5 border rounded-xl border-gray-200">
      <div className="flex gap-6">
        <SkeletonShimmer className="h-8 w-20" />
        <SkeletonShimmer className="h-8 w-20" />
        <SkeletonShimmer className="h-8 w-20" />
        <SkeletonShimmer className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-6 py-8">
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonShimmer className="h-8 w-40" />
          <SkeletonShimmer className="h-12" />
        </div>
      </div>
      <div className="flex justify-end">
        <SkeletonShimmer className="h-10 w-40" />
      </div>
    </div>
  );
};

export default vehicleDetailsLoading;
