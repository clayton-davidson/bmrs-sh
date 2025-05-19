import { NextResponse } from "next/server";
import { getRollings } from "@/lib/data/home/rolling-mill";

export async function GET() {
  try {
    const rollingsData = await getRollings();
    return NextResponse.json(rollingsData);
  } catch (error) {
    console.error("Error fetching rollings:", error);

    return NextResponse.json(
      { error: "Failed to fetch rollings" },
      { status: 500 }
    );
  }
}
