import { ReactNode } from "react";
import SideBarNavigation from "../components/navigations/sideBarNavigation";
import TopNavigation from "../components/navigations/topNavigation";
import Link from "next/link";
import { NavItem } from "../components/navigations/navData";

interface NavigationLayoutProps {
  children: ReactNode;
  authorizedItems: NavItem[];
}

export default function NavigationLayout({
  children,
  authorizedItems,
}: NavigationLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Column: Sidebar & Brand Header */}
      <div className="w-20 hover:w-[15%] transition-all duration-300 bg-[#004953] flex flex-col shrink-0 overflow-hidden relative z-50 group/nav shadow-[1px_0_0_0_rgba(255,255,255,0.05)] hover:shadow-2xl">
        <div className="h-20 flex items-center bg-[#004953] shrink-0 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center space-x-3 mx-auto transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 border border-white/40 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow shrink-0">
              FC
            </div>
            {/* Show label only on hover of this column */}
            <div className="w-0 scale-x-0 opacity-0 group-hover/nav:w-auto group-hover/nav:scale-x-100 group-hover/nav:opacity-100 transition-all duration-300 flex flex-col origin-left overflow-hidden">
              <span className="text-3xl font-bold text-white group-hover:text-primary-600 transition-colors whitespace-nowrap">
                FleetCo
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white">
          <SideBarNavigation authorizedItems={authorizedItems} />
        </div>
      </div>

      {/* Right Column: Top Navigation & Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="h-20 shrink-0 border-b border-black/10">
          <TopNavigation />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-white">{children}</div>
      </div>
    </div>
  );
}
