import { ReactNode } from "react";
import SideBarNavigation from "../components/navigations/sideBarNavigation";
import TopNavigation from "../components/navigations/topNavigation";
import { auth } from "../auth";
import { redirect } from "next/navigation";

const WebLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  if (!session) {
    // If the user is not authenticated, redirect to the login page
    redirect("/login");
  }
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
