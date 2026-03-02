import { auth } from "@/app/auth";
import UserDropdown from "./UserDropdown";
import NotificationDrawer from "../notification/NotificationDrawer";
import CurrentPageTitle from "./CurrentPageTitle";
import HeaderActions from "./HeaderActions";
import TopSubTabs from "./TopSubTabs";
import TopNavActions from "./TopNavActions";

const TopNavigation = async () => {
  const session = await auth();
  return (
    <div className="flex flex-col shrink-0">
      <div className="flex justify-between items-center px-9 bg-white text-black h-[10vh] border-b border-black/5">
        <div className="flex items-center gap-3">
          <CurrentPageTitle />
        </div>
        <TopNavActions session={session} />
      </div>
      <TopSubTabs />
    </div>
  );
};

export default TopNavigation;
