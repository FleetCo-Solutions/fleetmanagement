import { ReactNode } from "react";
import SideBarNavigation from "../components/navigations/sideBarNavigation";
import TopNavigation from "../components/navigations/topNavigation";

const WebLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="flex">
        <SideBarNavigation />
        <div className="w-[94%]">
          <div>
            <TopNavigation />
          </div>
          <div className="h-[93vh] overflow-auto bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default WebLayout;
