import { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

const HeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-6">
    <div className="space-y-2">
      <SkeletonShimmer className="h-8 w-20" />
      <SkeletonShimmer className="h-6 w-36" />
    </div>

    <SkeletonShimmer className="h-10 w-24" />
  </div>
);

const PermissionSkeleton = () => (
  <div className="flex flex-wrap gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonShimmer key={i} className="h-5 w-20 rounded-xl" />
    ))}
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white border border-black/20 rounded-xl p-6 flex flex-col">
    <div className="space-y-2 mb-4">
      <SkeletonShimmer className="h-5 w-20" />
      <SkeletonShimmer className="h-5 w-20" />
    </div>

    <div className="flex-1 mb-4">
      <h5 className="text-xs font-bold uppercase text-black/40 mb-2">
        Permissions
      </h5>
      <PermissionSkeleton />
    </div>

    <div className="flex gap-2 pt-4 border-t border-gray-100">
      <SkeletonShimmer className="h-5 w-20" />
      <SkeletonShimmer className="h-5 w-20" />
    </div>
  </div>
);

export const SkeletonGrid = () => (
  <div>
    <HeaderSkeleton />

    <SkeletonShimmer className="h-12 w-full mb-6" />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);
