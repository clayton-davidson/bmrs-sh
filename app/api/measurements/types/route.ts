import { NextResponse } from "next/server";
import { getMeasurementTypes } from "@/features/measurements/server/db/measurements";

export async function GET() {
  try {
    const data = await getMeasurementTypes();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching measurement types:", error);
    return NextResponse.json(
      { error: "Failed to fetch measurement types" },
      { status: 500 }
    );
  }
}
