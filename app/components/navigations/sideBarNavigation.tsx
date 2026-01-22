"use client";
import React from "react";
import SidebarItem from "./sideBarItem";
import { sideBarItems } from "./sideBarItems";
import { useSession } from "next-auth/react";
import { NavItem } from "./navData";

interface SideBarNavigationProps {
  authorizedItems?: NavItem[];
}

const SideBarNavigation = ({ authorizedItems }: SideBarNavigationProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
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
      className={`w-[15%] bg-[#EBEBEB] h-full border-r-[1px] border-black/10`}
    >
      <ul
        className={`text-black flex flex-col gap-1 py-5 font-extrabold ${
          collapsed ? "items-center w-[30%] bg-red-900" : "items-stretch"
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
          />
        ))}
      </ul>
    </div>
  );
};

export default SideBarNavigation;
