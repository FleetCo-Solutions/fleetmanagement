import { auth } from "@/app/auth";
import UserDropdown from "./UserDropdown";
import NotificationDrawer from "../notification/NotificationDrawer";
<<<<<<< Updated upstream
import CurrentPageTitle from "./CurrentPageTitle";
import HeaderActions from "./HeaderActions";
import TopSubTabs from "./TopSubTabs";
import TopNavActions from "./TopNavActions";
=======
import DynamicHeader from "./DynamicHeader";
>>>>>>> Stashed changes

const TopNavigation = async () => {
  const session = await auth();
  return (
<<<<<<< Updated upstream
    <div className="flex flex-col shrink-0">
      <div className="flex justify-between items-center px-9 bg-white text-black h-[10vh] border-b border-black/5">
        <div className="flex items-center gap-3">
          <CurrentPageTitle />
        </div>
        <TopNavActions session={session} />
=======
    <div className="flex flex-1 justify-between items-center px-4 bg-white text-black h-full">
      <div className="flex items-center gap-3">
        <DynamicHeader />
      </div>
      <div className="flex gap-3 items-center">
        <NotificationDrawer />
        <UserDropdown
          imageSrc="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100149.jpg?t=st=1753541121~exp=1753544721~hmac=97d073003530b562fde1ff78c4045722159b9f30825be2ed48e9d2acad9799f5&w=1380"
          userName={session?.user?.name}
          userRole={session?.user?.role[0]}
        />
>>>>>>> Stashed changes
      </div>
      <TopSubTabs />
    </div>
  );
};

export default TopNavigation;
