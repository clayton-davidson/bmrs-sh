"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MenuItem } from "@/types/navigation/menu-item";

const items: MenuItem[] = [
  {
    label: "Configuration",
    children: [
      {
        label: "Family Tree",
        url: "/configuration/family-tree",
      },
      {
        label: "Items",
        url: "/configuration/item",
      },
      {
        label: "Locations",
        url: "/configuration/location",
      },
      {
        label: "Materials",
        url: "/configuration/material",
      },
      {
        label: "Passes",
        url: "/configuration/pass",
      },
      {
        label: "Products",
        url: "/configuration/product",
      },
      {
        label: "Product Groups",
        url: "/configuration/product-group",
      },
      {
        label: "Purchase Orders",
        url: "/configuration/purchase-order",
      },
      {
        label: "Roll Barrels",
        url: "/configuration/roll-barrel",
      },
      {
        label: "Statuses",
        url: "/configuration/status",
      },
      {
        label: "Suppliers",
        url: "/configuration/supplier",
      },
    ],
  },
  {
    label: "Equipment",
    children: [
      {
        label: "Arbors",
        url: "/equipment/arbor",
      },
      {
        label: "Rings",
        url: "/equipment/ring",
      },
      {
        label: "Two High Rolls",
        url: "/equipment/two-high-roll",
      },
      {
        label: "Universal Rolls",
        url: "/equipment/universal-roll",
      },
      {
        label: "Vertical Rolls",
        url: "/equipment/vertical-roll",
      },
      {
        label: "Roll Sets",
        url: "/equipment/roll-set",
      },
      {
        label: "Chocks",
        url: "/equipment/chock",
      },
      {
        label: "Bearings",
        url: "/equipment/bearing",
      },
      {
        label: "Vertical Bearings",
        url: "/equipment/vertical-bearing",
      },
    ],
  },
  {
    label: "Mill",
    children: [
      {
        label: "Lineup",
        url: "/mill/lineup",
      },
      {
        label: "Plans",
        url: "/mill/plan",
      },
      {
        label: "Planning",
        url: "/mill/planning",
      },
      {
        label: "Plan Optimization",
        url: "/mill/plan-optimization",
      },
      {
        label: "Planning Archive",
        url: "/mill/planning-archive",
      },
      {
        label: "Setup Sheets",
        url: "/mill/setup-sheet",
      },
    ],
  },
  {
    label: "Reports",
    children: [
      {
        label: "Rolls First Turned",
        url: "/reports/rolls-first-turned",
      },
      {
        label: "Scrapped Rolls",
        url: "/reports/scrapped-rolls",
      },
      {
        label: "Location History",
        url: "/reports/location-history",
      },
      {
        label: "Inventory",
        url: "/reports/inventory",
      },
      {
        label: "Cuts by Teammate",
        url: "/reports/cuts-by-teammate",
      },
    ],
  },
  {
    label: "Admin",
    children: [
      {
        label: "Manage Users",
        url: "http://nsb-bml2-websvr:8080/keycloak/admin/master/console/",
      },
    ],
  },
  {
    label: "Nucor Links",
    children: [
      {
        label: "Beam Mill",
        url: "http://nsb-beammillweb",
      },
      {
        label: "Old Beam Mill",
        url: "http://nsb-beammill",
      },
      {
        label: "Beam Caster",
        url: "http://nsb-beamcasterweb",
      },
      {
        label: "Old Beam Caster",
        url: "http://nsb-beamcaster",
      },
      {
        label: "CSP Caster",
        url: "http://nsb-caster",
      },
      {
        label: "Hot Mill",
        url: "http://nsb-hotmill",
      },
      {
        label: "Hot Mill Rollshop",
        url: "http://nsb-hm-rollshop",
      },
      {
        label: "Melt Shop",
        url: "http://nsb-meltweb/meltshop",
      },
      {
        label: "Old Melt Shop",
        url: "http://nsb-meltshop",
      },
      {
        label: "Mold Shop",
        url: "http://nsb-moldshopweb",
      },
      {
        label: "Pickle Lines",
        url: "http://nsb-picklelines",
      },
      {
        label: "Refractory",
        url: "http://refractory/Ladles",
      },
      {
        label: "Bookings",
        url: "http://nsb-bookings/",
      },
      {
        label: "Cold Mill",
        url: "http://nsb-cm-home",
      },
      {
        label: "Cold Mill Rollshop",
        url: "http://nsb-cmrollshop",
      },
      {
        label: "Maintenance",
        url: "http://nsb-maintenance",
      },
      {
        label: "Warehouse",
        url: "http://nsb-warehouse/WarehouseInventory/WarehouseItemSearch",
      },
      {
        label: "Instantaneous Power Readings",
        url: "http://meltshop/power/powerinstant.aspx",
      },
      {
        label: "Lockouts",
        url: "http://meltshop/general/meltshopmain.aspx",
      },
      {
        label: "Meeting Sign In Sheet",
        url: "http://nsb-signinsheet",
      },
      {
        label: "Nucor Corporate",
        url: "https://www.nucor.com",
      },
      {
        label: "Nucor Net",
        url: "https://www.nucornet.com",
      },
      {
        label: "Safety Home Page",
        url: "https://nucor.sharepoint.com/sites/NSBCSafety",
      },
      {
        label: "Sharepoint",
        url: "https://nucor.sharepoint.com/sites/NSBC",
      },
      {
        label: "Stars",
        url: "http://stars",
      },
      {
        label: "Star Performance",
        url: "http://nsb-maintenance/StarPerformance",
      },
      {
        label: "Teammate Listing",
        url: "https://nucor.sharepoint.com/sites/NSBC/SitePages/PeopleDirectory.aspx#//cards",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
