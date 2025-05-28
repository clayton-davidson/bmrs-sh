import { NextResponse } from "next/server";
import { getLatestMeasurements } from "@/features/measurements/server/db/measurements";

export async function GET() {
  try {
    const data = await getLatestMeasurements();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching latest measurements:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest measurements" },
      { status: 500 }
    );
  }
}
