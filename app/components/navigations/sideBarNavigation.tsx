"use client";
import Link from "next/link";
import React from "react";
import LogOutBtn from "./logOutBtn";
import SidebarItem from "./sideBarItem";
import { sideBarItems } from "./sideBarItems";
import { useSession } from "next-auth/react";

const SideBarNavigation = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { data: session } = useSession();
  const userPermissions = (session?.user as any)?.permissions || [];

  const filteredItems = sideBarItems.filter((item) => {
    if (!(item as any).permission) return true;
    return userPermissions.includes((item as any).permission);
  });

  return (
    <div
      className={`w-[15%] bg-[#EBEBEB] h-full border-r-[1px] border-black/10`}
    >
      <ul
        className={`text-black flex flex-col gap-1 py-5 font-extrabold ${
          collapsed ? "items-center w-[30%] bg-red-900" : "items-stretch"
        }`}
      >
        {filteredItems.map((item, index) => (
          <SidebarItem
            key={index}
            route={item.route}
            itemName={item.itemName}
            itemIcon={item.itemIcon}
            subItems={item.children}
            isCollapsed={collapsed}
          />
        ))}
      </ul>
      {/* <div className="text-black flex flex-col gap-1 my-5 font-extrabold">
        <LogOutBtn />
      </div> */}
    </div>
  );
};

export default SideBarNavigation;
