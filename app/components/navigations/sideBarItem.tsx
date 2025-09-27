"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import LogOutBtn from "./logOutBtn";

interface SidebarSubItem {
  subItemName: string;
  route?: string;
}

interface SidebarItemProps {
  itemName: string;
  route: string;
  itemIcon: React.ReactNode;
  subItems?: SidebarSubItem[];
  isCollapsed?: boolean;
}

export default function SidebarItem({ ...props }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === props.route || (props.route !== "/" && pathname.startsWith(props.route));
  const hasChildren = (props.subItems?.length || 0) > 0;
  const isAnyChildActive = useMemo(
    () => (props.subItems || []).some((s) => s.route && pathname === s.route),
    [pathname, props.subItems]
  );
  const [open, setOpen] = useState(isActive || isAnyChildActive);

  return (
    <li className="mx-3">
      {/* Main Item */}
      <div
        onClick={() => hasChildren ? setOpen((v) => !v) : undefined}
        className={`rounded-lg p-1 flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isActive || isAnyChildActive
            ? "bg-[#004953] text-white shadow-md"
            : "hover:bg-[#004953] hover:text-white"
        }`}
      >
        <Link href={props.route} className="flex-1">
          <div className={`flex items-center gap-2 ${props.isCollapsed ? "justify-center" : "justify-start"}`}>
            <div className={`p-3 rounded-xl flex items-center justify-center ${props.isCollapsed ? "mx-auto" : ""}`}>{props.itemIcon}</div>
            {!props.isCollapsed && <span>{props.itemName}</span>}
          </div>
        </Link>

        {hasChildren && !props.isCollapsed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`size-5 mx-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </div>

      {/* Dropdown Children */}
      {hasChildren && !props.isCollapsed && (
        <ul
          className={`pl-10 pr-3 overflow-hidden transition-all duration-300 ease-in-out text-sm text-black/70 ${
            open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {(props.subItems || []).map((subItem, index) => {
            const subActive = subItem.route ? pathname === subItem.route : false;
            return (
              <li key={index} className="py-1">
                <div className="flex items-center gap-2">
                  <span className="text-black/40">•</span>
                  {subItem.route ? (
                    <Link
                      href={subItem.route}
                      className={`${subActive ? "text-[#004953]" : "hover:text-[#004953]"}`}
                    >
                      {subItem.subItemName}
                    </Link>
                  ) : (
                    <span className="text-black/70">{subItem.subItemName}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
