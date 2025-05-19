import { NextResponse } from "next/server";
import { getBloomYardInventory } from "@/features/bloom-yard/server/db/bloom-yard";

export async function GET() {
  try {
    const bloomYardData = await getBloomYardInventory();
    return NextResponse.json(bloomYardData);
  } catch (error) {
    console.error("Error fetching bloom yard data:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard data" },
      { status: 500 }
    );
  }
}
