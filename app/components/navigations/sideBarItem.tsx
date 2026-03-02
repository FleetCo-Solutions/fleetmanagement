"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

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
  onItemClick?: () => void;
}

export default function SidebarItem({ ...props }: SidebarItemProps) {
  const pathname = usePathname();
  const hasChildren = (props.subItems?.length || 0) > 0;

  const isAnyChildActive = useMemo(
    () => (props.subItems || []).some((s) => s.route && pathname === s.route),
    [pathname, props.subItems]
  );

  // Parent is only active if it's the exact route AND no child is active
  const isActive =
    !hasChildren &&
    (pathname === props.route ||
      (props.route !== "/" && pathname.startsWith(props.route)));

  const [open, setOpen] = useState(isActive || isAnyChildActive);

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
      </div>

      {/* Dropdown Children */}
      {hasChildren && !props.isCollapsed && (
        <ul
          className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-[#5eead4]/80 ${open ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
        >
          {(props.subItems || []).map((subItem, index) => {
            const subActive = subItem.route
              ? pathname === subItem.route
              : false;
            return (
              <li
                key={index}
                className="flex-1 flex items-center gap-2 border-l-[2px] border-[#5eead4]/30 ml-6"
              >
                {subItem.route ? (
                  <Link
                    href={subItem.route}
                    onClick={props.onItemClick}
                    className={`flex items-center gap-2 pl-4 ml-5 my-0.5 hover:bg-[#5eead4]/20 hover:text-white transition-colors rounded-lg w-full py-2 ${subActive ? "bg-[#5eead4] text-[#004953]" : ""
                      }`}
                  >
                    <span>{subItem.subItemName}</span>
                  </Link>
                ) : (
                  <span className="text-[#5eead4]/70 py-2">
                    {subItem.subItemName}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

