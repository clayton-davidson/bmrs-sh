import { getBloomYardCurrent } from "@/features/bloom-yard/server/db/bloom-yard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bloomYardCurrent = await getBloomYardCurrent();

    return NextResponse.json(bloomYardCurrent);
  } catch (error) {
    console.error("Error fetching bloom yard current:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard current" },
      { status: 500 }
    );
  }
}
