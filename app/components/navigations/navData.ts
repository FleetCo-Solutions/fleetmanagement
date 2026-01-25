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
];
