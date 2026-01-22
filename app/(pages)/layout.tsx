import { ReactNode } from "react";
import SideBarNavigation from "../components/navigations/sideBarNavigation";
import TopNavigation from "../components/navigations/topNavigation";
import Link from "next/link";
import { auth } from "../auth";
import { navItems } from "../components/navigations/navData";

const WebLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const userPermissions = (session?.user as any)?.permissions || [];

  const authorizedItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return userPermissions.includes(item.permission);
  });

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[15%] h-[7vh] bg-[#004953] flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center space-x-3 mx-3 px-4 group transition-all`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 border border-white/40 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                FC
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white group-hover:text-primary-600 transition-colors">
                  FleetCo
                </span>
              </div>
            </Link>
            <button
              // onClick={() => setCollapsed((v) => !v)}
              className="text-white mx-3 p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <TopNavigation />
        </div>
        <div className="flex h-[93vh]">
          <SideBarNavigation authorizedItems={authorizedItems} />
          <div className=" overflow-auto bg-white h-full flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebLayout;
