import { Receipt, Users } from "lucide-react";
import { TGroupMenuItem } from "./sidebar";

export const cmsSidebarMenuItems: TGroupMenuItem[] = [
  {
    groupLabel: "Main",
    menuItems: [
      {
        title: "Leads",
        url: "/admin/leads",
        icon: Users,
      },
      {
        title: "Ledgers",
        url: "/admin/ledgers",
        icon: Receipt,
      },
    ],
  },
];
