"use client";

import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import Linechart from "./components/linechart";
import DonutChart from "./components/donutChart";
import TempTable from "./components/tempTable";
import { useDashboardSummaryQuery } from "./query";
import UniversalTableSkeleton, { SkeletonShimmer } from "@/app/components/universalTableSkeleton";

const DashboardPage = () => {
  const { data: summaryData, isLoading } = useDashboardSummaryQuery();

  if (isLoading) {
    return (
      <div className="bg-white w-full h-full flex flex-col items-center overflow-y-auto pt-10 pb-20">
        <div className="w-[96%] flex flex-col gap-10">
          <div className="flex justify-between w-full gap-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonShimmer key={index} className="h-36 w-[30%] rounded-xl" />
            ))}
          </div>
          <div className="flex justify-between">
            <SkeletonShimmer className="h-[45vh] w-[70%] rounded-lg rounded-xl"/>
            <SkeletonShimmer className="h-[45vh] w-[26%] rounded-lg rounded-xl"/>
          </div>
          <div>
            <UniversalTableSkeleton title="Loading Trips ... " rows={2} columns={7}/>
          </div>
        </div>
      </div>
    );
  }

  const stats = summaryData?.data?.vehicles;

  const recentTrips = summaryData?.data?.recentTrips || [];

  return (
    <div className="bg-white w-full h-full flex flex-col items-center overflow-y-auto pt-10 pb-20">
      <div className="w-[96%] flex flex-col gap-10">
        <div className="flex justify-between gap-10">
          <OverviewRealTime
            title="Total Vehicles"
            quantity={stats.total}
            description={`${stats.available} Active`}
          />
          <OverviewRealTime
            title="Available Vehicles"
            quantity={stats.available}
            description="Ready for dispatch"
          />
          <OverviewRealTime
            title="Out of Service"
            quantity={stats.outOfService}
            description={`${stats.underMaintenance} Under Maintenance`}
          />
          <OverviewRealTime
            title="Safety Rate"
            quantity="98.5%" // Mock for now
            description="Equipment Fault Rate: 1.5%"
          />
        </div>
        <div className="flex justify-between">
          <div className="border-[1px] border-black/20 rounded-xl flex flex-col gap-5 py-5 w-[72%]">
            <span className="text-2xl font-semibold text-black pl-10">
              Summary Performance
            </span>
            <Linechart />
          </div>
          <div className="border-[1px] border-black/20 rounded-xl flex flex-col gap-5 py-5 w-[25%]">
            <span className="text-2xl font-semibold text-black pl-10">
              Violations Breakdown
            </span>
            <DonutChart />
          </div>
        </div>
        <div className="border-[1px] border-black/20 rounded-xl flex flex-col gap-5 p-5 bg-white ">
          <span className="text-2xl font-semibold text-black ">
            Recent Trips
          </span>
          {recentTrips && recentTrips.length > 0 ? (
            <TempTable data={recentTrips} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 font-medium text-lg">
                No Trips Available
              </p>
              <p className="text-gray-400 text-sm">
                Recent trip history will appear here once trips are recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
