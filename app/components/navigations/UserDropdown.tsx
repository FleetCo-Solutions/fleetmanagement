"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UserDropdownProps {
  imageSrc: string;
  userName?: string | null;
  userRole?: string | null;
}

export default function UserDropdown({
  imageSrc,
  userName,
  userRole,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-3 items-center relative cursor-pointer" ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
      <div className="flex flex-col items-end">
        <span className="text-lg font-medium">{userName}</span>
        <span className="text-sm text-gray-500">{userRole}</span>
      </div>
      <button
        className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-transparent hover:border-[#004953] transition-all focus:outline-none"
      >
        <Image
          src={imageSrc}
          width={50}
          height={50}
          alt="User Avatar"
          className="object-cover w-full h-full"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 md:hidden">
            <p className="font-medium text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">{userRole}</p>
          </div>

          <button
            onClick={() => {
              // Add profile navigation logic here if needed
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004953] transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => {
              // Add settings navigation logic here if needed
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004953] transition-colors"
          >
            Settings
          </button>
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={() => signOut({callbackUrl: "/login"})}
            className="w-full text-left font-semibold px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
