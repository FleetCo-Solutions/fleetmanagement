"use client";
import Link from "next/link";

interface SidebarItemProps {
  itemName: string;
  route: string;
  itemIcon: React.ReactNode;
  subItems?: { subItemName: string }[];
}

export default function SidebarItem({ ...props }: SidebarItemProps) {
  // const [open, setOpen] = useState(false);

  return (
    <Link href={props.route}>
      <li className="mx-3">
        {/* Main Item */}
        <div
          // onClick={() => setOpen(!open)}
          className="rounded-lg py-3 px-3 flex justify-center items-center cursor-pointer transition-colors duration-200"
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="bg-white p-3 rounded-xl">{props.itemIcon}</div>

            <span>{props.itemName}</span>
          </div>

          {/* Arrow rotates when open */}
          {/* {props.children && <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>} */}
        </div>

        {/* Dropdown Children */}
        {/* {props.children && <ul
        className={`pl-10 pr-3 overflow-hidden transition-all duration-300 ease-in-out text-sm text-black/70 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {props.children.map((subItem, index) => (
          <li key={index} className="py-2 hover:text-green-600 cursor-pointer">
            {subItem.subItemName}
          </li>
        ))}
      </ul>} */}
      </li>
    </Link>
  );
}
