import { NextResponse } from "next/server";
import { getPasses } from "@/lib/data/configuration/pass";

export async function GET() {
  try {
    const passes = await getPasses();

    return NextResponse.json(passes);
  } catch (error) {
    console.error("Error fetching pass data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pass data" },
      { status: 500 }
    );
  }
}
