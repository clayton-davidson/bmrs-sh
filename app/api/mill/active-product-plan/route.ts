import { NextResponse } from "next/server";
import { getActiveProductPlan } from "@/lib/data/mill/planning";

export async function GET() {
  try {
    const activeProductPlan = await getActiveProductPlan();

    return NextResponse.json(activeProductPlan);
  } catch (error) {
    console.error("Error fetching active product plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch active product plan" },
      { status: 500 }
    );
  }
}
