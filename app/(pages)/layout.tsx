import { ReactNode } from "react";
import { auth } from "../auth";
import { navItems } from "../components/navigations/navData";
import NavigationLayout from "./NavigationLayout";

const WebLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const userPermissions = (session?.user as any)?.permissions || [];

  const authorizedItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return userPermissions.includes(item.permission);
  });

  return (
<<<<<<< Updated upstream
    <div className="flex h-screen w-full overflow-hidden">
      {/* Full-height Retractable Sidebar */}
      <SideBarNavigation authorizedItems={authorizedItems} />

      {/* Main Content Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <TopNavigation />
        <div className="flex-1 overflow-auto bg-[#F8F9FA]">
          {children}
        </div>
      </div>
    </div>
=======
    <NavigationLayout authorizedItems={authorizedItems}>
      {children}
    </NavigationLayout>
>>>>>>> Stashed changes
  );
};

export default WebLayout;
