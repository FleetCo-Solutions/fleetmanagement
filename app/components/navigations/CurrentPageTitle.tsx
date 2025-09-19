"use client";
import { usePathname } from "next/navigation";

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getTitleFromPath(pathname: string): string {
  if (!pathname || pathname === "/") return "Dashboard";

  const segments = pathname.split("/").filter(Boolean);

  // Map first segment to primary section name
  const section = segments[0];
  const sectionMap: Record<string, string> = {
    asset: "Fleet Assets",
    drivers: "Drivers Management",
    trips: "Trips Management",
    fuel: "Fuel Management",
    maintenance: "Maintenance Management",
    userManagement: "User Management",
   
  };

  const baseTitle = sectionMap[section] ?? toTitleCase(section);

  // Optionally include subpage details if present and meaningful
  if (segments.length > 1) {
    const sub = segments[1];
    // Skip dynamic ids like [id] numeric/uuid-ish segments
    const isDynamic = /^(\d+|[0-9a-fA-F-]{8,})$/.test(sub);
    if (!isDynamic) {
      return `${baseTitle} · ${toTitleCase(sub)}`;
    }
  }

  return baseTitle;
}

export default function CurrentPageTitle() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname ?? "/");

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold text-black">{title}</h1>
    </div>
  );
}


