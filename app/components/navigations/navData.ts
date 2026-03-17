export interface NavItem {
  itemName: string;
  route: string;
  permission?: string;
  children?: { subItemName: string; route: string }[];
}

export const navItems: NavItem[] = [
  {
    itemName: "Dashboard",
    route: "/",
  },
  {
    itemName: "Asset",
    route: "/asset",
    permission: "vehicle.read",
    children: [
      { subItemName: "Vehicle List", route: "/asset" },
      // { subItemName: "Vehicle Assignment", route: "/asset/assignment" },
    ],
  },
  {
    itemName: "Drivers",
    route: "/drivers",
    permission: "driver.read",
  },
  {
    itemName: "Trips",
    route: "/trips",
    permission: "trip.read",
  },
  {
    itemName: "Tracking",
    route: "/tracking",
    children: [
      { subItemName: "Live Tracking", route: "/tracking/live" },
      { subItemName: "History Replay", route: "/tracking/history" },
    ],
  },
  // {
  //   itemName: "Fuel",
  //   route: "/fuel",
  //   permission: "maintenance.read",
  // },
  // {
  //   itemName: "Maintenance",
  //   route: "/maintenance",
  //   permission: "maintenance.read",
  //   children: [
  //     { subItemName: "Overview", route: "/maintenance" },
  //     { subItemName: "Orders", route: "/maintenance/orders" },
  //   ],
  // },
  {
    itemName: "User Management",
    route: "/userManagement",
    permission: "user.read",
  },
  {
    itemName: "Audit Logs",
    route: "/auditLogs",
    permission: "audit.read",
  },
  {
    itemName: "Configurations",
    route: "/configurations",
    children: [
      { subItemName: "Devices", route: "/configurations/devices" },
      { subItemName: "Events & Alerts", route: "/configurations/events" },
      { subItemName: "Geofences", route: "/configurations/geofences" },
      { subItemName: "Maintenance Rules", route: "/configurations/maintenance" },
      { subItemName: "Telemetry", route: "/configurations/telemetry" },
      { subItemName: "User Permissions", route: "/configurations/permissions" },
      { subItemName: "Integrations", route: "/configurations/integrations" },
      { subItemName: "Branding", route: "/configurations/branding" },
    ],
  },
];
