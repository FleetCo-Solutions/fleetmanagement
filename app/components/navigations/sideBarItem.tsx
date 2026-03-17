"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useMemo } from "react";

interface SidebarSubItem {
  subItemName: string;
  route?: string;
}

interface SidebarItemProps {
  itemName: string;
  route: string;
  itemIcon: React.ReactNode;
  subItems?: SidebarSubItem[];
<<<<<<< Updated upstream
  isCollapsed?: boolean;
  onItemClick?: () => void;
=======
>>>>>>> Stashed changes
}

export default function SidebarItem({ ...props }: SidebarItemProps) {
  const pathname = usePathname();
  const hasChildren = (props.subItems?.length || 0) > 0;

  const isAnyChildActive = useMemo(
    () => (props.subItems || []).some((s) => s.route && pathname === s.route),
    [pathname, props.subItems]
  );

  const isActive =
    !hasChildren &&
    (pathname === props.route ||
      (props.route !== "/" && pathname.startsWith(props.route)));

  const [open, setOpen] = useState(isActive || isAnyChildActive);

<<<<<<< Updated upstream
  return (
    <li className={`${props.isCollapsed ? "mx-1" : "mx-3"}`}>
      {/* Main Item */}
      <div
        onClick={() => (hasChildren ? setOpen((v) => !v) : undefined)}
        className={`rounded-xl p-1 flex items-center justify-between cursor-pointer transition-all duration-200 ${isActive
          ? "bg-[#5eead4] text-[#004953] shadow-lg"
          : "text-[#5eead4] hover:bg-white/10"
          }`}
      >
        {hasChildren ? (
          <div className="flex-1 flex items-center gap-2">
            <div
              className={`p-3 rounded-xl flex items-center justify-center ${props.isCollapsed ? "mx-auto" : ""
                }`}
            >
              {props.itemIcon}
            </div>
            {!props.isCollapsed && (
              <span className="whitespace-nowrap">{props.itemName}</span>
            )}
          </div>
        ) : (
          <Link
            href={props.route}
            className="flex-1"
            onClick={props.onItemClick}
          >
            <div
              className={`flex items-center gap-2 ${props.isCollapsed ? "justify-center" : "justify-start"
                }`}
            >
              <div
                className={`p-3 rounded-xl flex items-center justify-center ${props.isCollapsed ? "mx-auto" : ""
                  }`}
              >
                {props.itemIcon}
              </div>
              {!props.isCollapsed && (
                <span className="whitespace-nowrap">{props.itemName}</span>
              )}
            </div>
          </Link>
        )}

        {hasChildren && !props.isCollapsed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`size-5 mx-2 transition-transform duration-300 ${open ? "rotate-180" : ""
              }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        )}
=======
  const content = (
    <div className="flex items-center justify-center group-hover/nav:justify-start w-full transition-all duration-300 px-2 h-14 relative group">
      <div
        className={`flex items-center justify-center shrink-0 w-12 h-12 rounded-xl transition-all duration-300 ${
          isActive ? "bg-white/10" : ""
        }`}
      >
        {React.isValidElement(props.itemIcon) 
          ? React.cloneElement(props.itemIcon as any, { 
              className: "size-6 shrink-0" 
            })
          : props.itemIcon
        }
>>>>>>> Stashed changes
      </div>
      <span className="opacity-0 w-0 group-hover/nav:opacity-100 group-hover/nav:w-auto group-hover/nav:ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden origin-left font-semibold text-base">
        {props.itemName}
      </span>

      {hasChildren && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`size-4 ml-auto transition-all duration-300 absolute right-4 opacity-0 group-hover/nav:opacity-100 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      )}
    </div>
  );

  return (
    <li className="my-0.5">
      {/* Main Item */}
      {hasChildren ? (
        <div
          onClick={() => setOpen((v) => !v)}
          className={`rounded-xl p-0.5 flex items-center justify-center transition-all duration-300 cursor-pointer w-14 group-hover/nav:w-full mx-auto ${
            isActive || isAnyChildActive
              ? "bg-[#004953] text-white shadow-md font-bold"
              : "hover:bg-[#004953]/10 text-black/70 hover:text-[#004953]"
          }`}
        >
          {content}
        </div>
      ) : (
        <Link
          href={props.route}
          className={`rounded-xl p-0.5 flex items-center justify-center transition-all duration-300 w-14 group-hover/nav:w-full mx-auto ${
            isActive
              ? "bg-[#004953] text-white shadow-md font-bold"
              : "hover:bg-[#004953]/10 text-black/70 hover:text-[#004953]"
          }`}
        >
          {content}
        </Link>
      )}

      {/* Dropdown Children */}
      {hasChildren && (
        <ul
<<<<<<< Updated upstream
          className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-[#5eead4]/80 ${open ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
=======
          className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-black/70 group-hover/nav:block hidden ${
            open ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
>>>>>>> Stashed changes
        >
          {(props.subItems || []).map((subItem, index) => {
            const subActive = subItem.route
              ? pathname === subItem.route
              : false;
            return (
              <li
                key={index}
<<<<<<< Updated upstream
                className="flex-1 flex items-center gap-2 border-l-[2px] border-[#5eead4]/30 ml-6"
=======
                className={`flex items-center gap-2 border-l-2 ml-8 transition-colors ${
                  subActive ? "border-[#004953]" : "border-black/10 hover:border-[#004953]/50"
                }`}
>>>>>>> Stashed changes
              >
                {subItem.route ? (
                  <Link
                    href={subItem.route}
<<<<<<< Updated upstream
                    onClick={props.onItemClick}
                    className={`flex items-center gap-2 pl-4 ml-5 my-0.5 hover:bg-[#5eead4]/20 hover:text-white transition-colors rounded-lg w-full py-2 ${subActive ? "bg-[#5eead4] text-[#004953]" : ""
                      }`}
=======
                    className={`flex items-center gap-2 pl-4 ml-2 my-0.25 hover:bg-[#004953]/5 hover:text-[#004953] transition-all rounded-lg w-full py-2 font-medium ${
                      subActive ? "text-[#004953] font-bold" : ""
                    }`}
>>>>>>> Stashed changes
                  >
                    <span className="whitespace-nowrap">{subItem.subItemName}</span>
                  </Link>
                ) : (
<<<<<<< Updated upstream
                  <span className="text-[#5eead4]/70 py-2">
                    {subItem.subItemName}
                  </span>
=======
                  <span className="text-black/70 pl-4">{subItem.subItemName}</span>
>>>>>>> Stashed changes
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

