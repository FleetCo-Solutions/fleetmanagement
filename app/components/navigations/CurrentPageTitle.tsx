"use client";
import { usePathname } from "next/navigation";
import { useHeaderActions } from "@/app/context/HeaderActionsContext";

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
    asset: "Asset",
    drivers: "Drivers Management",
    trips: "Trips Management",
    fuel: "Fuel Management",
    maintenance: "Maintenance Management",
    userManagement: "User Management",

  };

  const baseTitle = sectionMap[section] ?? toTitleCase(section);

  // Optionally include subpage details if present and meaningful
  // (suppressed for 'asset' — always show just the section name)
  if (segments.length > 1 && section !== "asset") {
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
  const { titleOverride, statusBadge } = useHeaderActions();
  const title = titleOverride || getTitleFromPath(pathname ?? "/");

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold text-[#004953]">{title}</h1>
      {statusBadge}
    </div>
  );
}


