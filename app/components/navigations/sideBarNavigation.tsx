"use client";
import React from "react";
import SidebarItem from "./sideBarItem";
import { sideBarItems } from "./sideBarItems";
import { useSession } from "next-auth/react";
import { NavItem } from "./navData";
import Link from "next/link";

interface SideBarNavigationProps {
  authorizedItems?: NavItem[];
}

const SideBarNavigation = ({ authorizedItems }: SideBarNavigationProps) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { data: session } = useSession();
  const userPermissions = (session?.user as any)?.permissions || [];

  // Use authorizedItems if provided (SSR), otherwise fallback to client-side filtering
  const displayItems = React.useMemo(() => {
    if (authorizedItems) {
      // Map authorized items back to sideBarItems to get icons
      return authorizedItems.map((authItem) => {
        const fullItem = sideBarItems.find(
          (i) => i.itemName === authItem.itemName
        );
        return fullItem || authItem;
      });
    }

    return sideBarItems.filter((item) => {
      if (!(item as any).permission) return true;
      return userPermissions.includes((item as any).permission);
    });
  }, [authorizedItems, userPermissions]);

  return (
    <div
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`${collapsed ? "w-[5%]" : "w-[15%]"
        } bg-[#004953] h-full border-r-[1px] border-white/10 transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="h-[10vh] flex items-center px-4 overflow-hidden border-b border-white/10 shrink-0">
        <Link
          href="/"
          className="flex items-center space-x-3 transition-all duration-300"
        >
          <div className="min-w-[40px] h-10 bg-white rounded-xl flex items-center justify-center text-[#004953] font-extrabold text-xl shadow-lg ring-1 ring-black/5">
            FC
          </div>
          {!collapsed && (
            <span className="text-2xl font-bold text-white transition-all duration-300 whitespace-nowrap">
              FleetCo
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2">
        <ul
          className={`text-[#5eead4] flex flex-col gap-2.5 py-4 font-semibold ${collapsed ? "items-center" : "items-stretch"
            }`}
        >
          {displayItems.map((item, index) => (
            <SidebarItem
              key={index}
              route={item.route}
              itemName={item.itemName}
              itemIcon={(item as any).itemIcon}
              subItems={(item as any).children}
              isCollapsed={collapsed}
              onItemClick={() => setCollapsed(true)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBarNavigation;
