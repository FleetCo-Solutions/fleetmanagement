import OverviewRealTime from "@/app/components/cards/overviewRealTime";
import Linechart from "./components/linechart";
import DonutChart from "./components/donutChart";
import TempTable from "./components/tempTable";

const RealTimeData = () => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-10">
        <div className="flex justify-between gap-10">
          <OverviewRealTime
            title="Total Vehicles"
            quantity={459}
            description="+ 31"
          />
          <OverviewRealTime
            title="Available Vehicles"
            quantity={400}
            description="In trip: 230"
          />
          <OverviewRealTime
            title="Out of Service Vehicles"
            quantity={302}
            description="Under Maintenance: 30"
          />
          <OverviewRealTime
            title="Safety Rate"
            quantity="12.8%"
            description="Equipment Fault Rate: 80%"
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
          <TempTable />
        </div>
      </div>
    </div>
  );
};

export default RealTimeData;
