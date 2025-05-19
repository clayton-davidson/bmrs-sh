import { getBloomYardEnd } from "@/features/bloom-yard/server/db/bloom-yard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bloomYardEnd = await getBloomYardEnd();

    return NextResponse.json(bloomYardEnd);
  } catch (error) {
    console.error("Error fetching bloom yard end:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard end" },
      { status: 500 }
    );
  }
}
