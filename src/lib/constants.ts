import type { UserRole } from "@/types";

export type SidebarMenuItem = {
  label: string;
  href: string;
  icon: string;
};

export type SidebarMenuGroup = {
  id: string;
  label: string;
  roles: UserRole[];
  items: SidebarMenuItem[];
};

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    id: "spbu-analytics",
    label: "Analytics & Fraud",
    roles: ["SPBU_ADMIN"],
    items: [
      {
        label: "Analytics & Fraud",
        href: "/spbu-admin/analytics",
        icon: "bar-chart",
      },
    ],
  },
  {
    id: "spbu-staff",
    label: "Staff Management",
    roles: ["SPBU_ADMIN"],
    items: [
      {
        label: "Staff Management",
        href: "/spbu-admin/staff",
        icon: "users",
      },
    ],
  },
  {
    id: "gov-analytics",
    label: "National Analytics",
    roles: ["GOV_ADMIN"],
    items: [
      {
        label: "National Analytics",
        href: "/gov-admin/national-analytics",
        icon: "globe",
      },
    ],
  },
  {
    id: "gov-quota",
    label: "Quota Policy Engine",
    roles: ["GOV_ADMIN"],
    items: [
      {
        label: "Quota Policy Engine",
        href: "/gov-admin/quota-policy",
        icon: "sliders",
      },
    ],
  },
  {
    id: "gov-ai-fraud",
    label: "AI Fraud Config",
    roles: ["GOV_ADMIN"],
    items: [
      {
        label: "AI Fraud & Risk",
        href: "/gov-admin/ai-fraud-config",
        icon: "sparkles",
      },
    ],
  },
  {
    id: "company-fleet",
    label: "Fleet Registration",
    roles: ["COMPANY_ADMIN"],
    items: [
      { label: "Fleet Registration", href: "/company-admin/fleet", icon: "truck" },
   
    ],
  },
  {
    id: "company-drivers",
    label: "Driver Assignment",
    roles: ["COMPANY_ADMIN"],
    items: [
      { label: "Driver Assignment", href: "/company-admin/drivers", icon: "id-card" },
    ],
  },
];
