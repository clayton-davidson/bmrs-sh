import { getBloomYardConsumed } from "@/features/bloom-yard/server/db/bloom-yard";
import { NextRequest, NextResponse } from "next/server";
import { parseAsIsoDateTime, createLoader } from "nuqs/server";

const params = {
  startDate: parseAsIsoDateTime.withDefault(new Date(0)),
  stopDate: parseAsIsoDateTime.withDefault(new Date()),
};

const loadSearchParams = createLoader(params);

export async function GET(request: NextRequest) {
  try {
    const { startDate, stopDate } = loadSearchParams(request.url);

    const bloomYardConsumed = await getBloomYardConsumed(startDate, stopDate);

    return NextResponse.json(bloomYardConsumed);
  } catch (error) {
    console.error("Error fetching bloom yard consumed:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard consumed" },
      { status: 500 }
    );
  }
}
