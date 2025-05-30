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
    label: "Home",
    url: "/",
  },
  {
    label: "Reports",
    children: [
      { label: "Morning Meeting", url: "/reports/morning-meeting" },
      { label: "Delay Report", url: "/reports/delay" },
      { label: "Pacing Adjustments", url: "/reports/pace-change" },
      { label: "Scrap Report", url: "/reports/scrap" },
      { label: "Credit Report", url: "/reports/credit" },
      { label: "Shift Report", url: "/reports/shift" },
      { label: "Rolling Schedule", url: "/reports/rolling-schedule" },
      { label: "Achievement Report", url: "/reports/achievement" },
      { label: "Performance Charts", url: "/reports/performance-charts" },
      { label: "Tonnage Charts", url: "/reports/tonnage-charts" },
      { label: "Meeting Report", url: "/reports/meeting-report" },
      { label: "Logbook", url: "/reports/logbook" },
      { label: "Maintenance Items", url: "/reports/maintenance-items" },
      { label: "Daily Shift Inspections", url: "/reports/shift-inspections" },
      { label: "Measurements", url: "/reports/measurements" },
      { label: "Work Order Search", url: "/reports/work-order-search" },
    ],
  },
  {
    label: "Reheat",
    children: [
      { label: "Furnace Maps", url: "/reheat/furnace-maps" },
      { label: "BC/RHF Tracking", url: "/reheat/tracking" },
      { label: "Furnace Charge List", url: "/reheat/furnace-charge-list" },
      {
        label: "Dropout Temp Trend",
        url: "/reheat/furnace-dropout-temp",
      },
      {
        label: "Gas Consumption (SCF)",
        url: "/reheat/furnace-gas-consumption",
      },
      { label: "Cut Lengths", url: "/reheat/cut-lengths" },
      { label: "Heat Notes", url: "/reheat/heat-notes" },
      { label: "Cast Orders", url: "/reheat/orders" },
    ],
  },
  {
    label: "Rolling",
    children: [
      { label: "Production List", url: "/Rolling/ProductionList" },
      { label: "Shift Summary", url: "/Rolling/ShiftSummary" },
      { label: "Production Summary", url: "/Rolling/ProductionSummary" },
      { label: "Rolling Summary", url: "/Rolling/Summary" },
      { label: "Hourly Production", url: "/Rolling/HourlyProduction" },
      { label: "Stand Move Tracking", url: "/Rolling/StandMoveTracking" },
      {
        label: "Mill Setup Sheet",
        url: "https://nsb-bm-rs.sps.nucorsteel.local/mill/setup-sheet",
        external: true,
      },
      {
        label: "Average Tons by Product",
        url: "/Rolling/AverageTonsByProduct",
      },
      { label: "Cobbles and Rejects", url: "/Rolling/CobblesAndRejects" },
      { label: "Cobbles Summary", url: "/Rolling/CobbleSummary" },
      { label: "R-Factor by Stand", url: "/rolling/r-factor" },
      { label: "Rolling Notes", url: "/Rolling/Notes" },
    ],
  },
  {
    label: "Finishing",
    children: [
      { label: "Bundle Tag Log", url: "/Finishing/BundleTagLog" },
      { label: "Tag Log Detail", url: "/Finishing/TagDetail" },
      {
        label: "Bundle Reconciliation",
        url: "/Finishing/BundleReconciliation",
      },
      { label: "Bundles On Hold", url: "/Finishing/BundlesOnHold" },
      {
        label: "Bundles On Hold Charts",
        url: "/Finishing/BundlesOnHoldCharts",
      },
      {
        label: "Bundles Weight Tracking",
        url: "/Finishing/BundleWeightTracking",
      },
      {
        label: "Straightener Adjustments",
        url: "/Finishing/StraightenerAdjustments",
      },
      {
        label: "Straightener Adjustments Graph",
        url: "http://nsb-beammill/stradj/RollDeflectionGraph",
        external: true,
      },
      {
        label: "Straightener Roll Build Up",
        url: "http://nsb-beammill/StraightenerBuildup",
        external: true,
      },
      { label: "Finished Inventory", url: "/Finishing/FinishedInventory" },
      { label: "Saw Shop", url: "/Finishing/SawShop/Index" },
      {
        label: "Finished Inventory Summary",
        url: "/Finishing/FinishedInventorySummary",
      },
      {
        label: "Graph Finished Inventory By Product",
        url: "http://nsb-beammill/FinishedInventory/graphInventoryByProduct",
        external: true,
      },
      {
        label: "Graph Finished Inventory By Product Family",
        url: "http://nsb-beammill/FinishedInventory/graphInventoryByProductFamily",
        external: true,
      },
      { label: "Reweigh Bundles", url: "/Finishing/ReweighBundles" },
      {
        label: "Finished Product Tons By Heat",
        url: "/Finishing/FinishedTonsByHeat",
      },
      { label: "Stock Analysis", url: "/Finishing/StockAnalysis" },
    ],
  },
  {
    label: "Cooling Bed",
    children: [
      { label: "Current", url: "/cooling-bed/current" },
      { label: "Charged", url: "/cooling-bed/charged" },
      { label: "Discharged", url: "/cooling-bed/discharged" },
      { label: "History", url: "/cooling-bed/history" },
    ],
  },
  {
    label: "Bloom Yard",
    children: [
      { label: "Reconciliation", url: "/bloom-yard/reconciliation" },
      { label: "Inventory", url: "/bloom-yard/inventory" },
    ],
  },
  {
    label: "Sales",
    children: [
      { label: "Customer List", url: "/sales/customers" },
      {
        label: "Current Rolling Customers",
        url: "/sales/current-rolling-customers",
      },
    ],
  },
  {
    label: "Quality",
    children: [
      { label: "Process Capability", url: "/Quality/ProcessCapability" },
      { label: "Customer Claims", url: "/Quality/CustomerClaims" },
      {
        label: "Internal Rejects Charts",
        url: "/Quality/InternalRejectsCharts",
      },
      {
        label: "Dropout/HiproFlange Temperatures By Rolling",
        url: "/Quality/TemperaturesByRolling",
      },
      { label: "Customer Complaints", url: "/Quality/CustomerComplaints" },
      { label: "Special Tolerances", url: "/Quality/SpecialTolerances" },
      { label: "Inspection Search", url: "/Quality/InspectionDb" },
    ],
  },
  {
    label: "Lab",
    children: [
      { label: "Tensile Results", url: "/Lab/TensileResults" },
      { label: "Chemistry Samples", url: "/Lab/Sample" },
      { label: "Turnover Report", url: "/Lab/Turnoverlog" },
      { label: "Failed Tensile Results", url: "/Lab/FaieldTensileResults" },
    ],
  },
  {
    label: "Bonus",
    children: [
      { label: "Bonus Factors", url: "/Bonus/Factors" },
      { label: "Running Bonus", url: "/Bonus/Running" },
    ],
  },
  {
    label: "Nucor Links",
    children: [
      {
        label: "Safety Home Page",
        url: "https://nucor.sharepoint.com/sites/NSBCSafety",
        external: true,
      },
      {
        label: "Lockouts",
        url: "http://nsb-sharepoint/safety/lp/SitePages/Home.aspx",
        external: true,
      },
      {
        label: "Star Performance",
        url: "http://nsb-maintenance/StarPerformance",
        external: true,
      },
      {
        label: "Sharepoint",
        url: "https://nucor.sharepoint.com/sites/NSBC",
        external: true,
      },
      {
        label: "Nucor Net",
        url: "https://www.nucornet.com",
        external: true,
      },
      {
        label: "Nucor Corporate",
        url: "https://www.nucor.com",
        external: true,
      },
      {
        label: "Teammate Listing",
        url: "https://nucor.sharepoint.com/sites/NSBC/SitePages/PeopleDirectory.aspx#//cards",
        external: true,
      },
      {
        label: "Warehouse",
        url: "http://nsb-warehouse/WarehouseInventory/WarehouseItemSearch",
        external: true,
      },
      { label: "Beam Caster", url: "http://nsb-beamcaster", external: true },
      {
        label: "New Beam Caster",
        url: "http://nsb-beamcasterweb",
        external: true,
      },
      { label: "Hot Mill", url: "http://nsb-hotmill", external: true },
      {
        label: "Hot Mill Rollshop",
        url: "http://nsb-hm-rollshop",
        external: true,
      },
      {
        label: "Pickle Lines",
        url: "http://nsb-picklelines",
        external: true,
      },
      { label: "Cold Mill", url: "http://nsb-cm-home", external: true },
      {
        label: "Cold Mill Rollshop",
        url: "http://nsb-cmrollshop",
        external: true,
      },
      { label: "Old Beam Mill", url: "http://nsb-beammill", external: true },
      {
        label: "Beam Mill Rollshop",
        url: "https://nsb-bm-rs.sps.nucorsteel.local",
        external: true,
      },
      { label: "Mold Shop", url: "http://nsb-moldshopweb", external: true },
      { label: "Melt Shop", url: "http://nsb-meltshop", external: true },
      {
        label: "New Melt Shop",
        url: "http://nsb-meltweb/meltshop",
        external: true,
      },
      { label: "CSP Caster", url: "http://nsb-caster", external: true },
      {
        label: "Refractory",
        url: "http://refractory/Ladles",
        external: true,
      },
      {
        label: "Meeting Sign In Sheet",
        url: "http://nsb-signinsheet",
        external: true,
      },
      {
        label: "Instantaneous Power Readings",
        url: "http://meltshop/power/powerinstant.aspx",
        external: true,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))] overflow-hidden"
      {...props}
    >
      <SidebarContent className="flex flex-col h-full overflow-hidden">
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter className="flex-shrink-0">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
