import { NextResponse } from "next/server";
import { getCurrentCoolingBed } from "@/features/cooling-bed/server/db/cooling-bed";

export async function GET() {
  try {
    const coolingBedData = await getCurrentCoolingBed();
    return NextResponse.json(coolingBedData);
  } catch (error) {
    console.error("Error fetching cooling bed data:", error);

    return NextResponse.json(
      { error: "Failed to fetch cooling bed data" },
      { status: 500 }
    );
  }
}
