import {  getBloomYardRunnable } from "@/features/bloom-yard/server/db/bloom-yard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bloomYardRunnable = await getBloomYardRunnable();

    return NextResponse.json(bloomYardRunnable);
  } catch (error) {
    console.error("Error fetching bloom yard runnable:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard runnable" },
      { status: 500 }
    );
  }
}
