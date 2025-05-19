import { getBloomYardScrapped } from "@/features/bloom-yard/server/db/bloom-yard";
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

    const bloomYardScrapped = await getBloomYardScrapped(startDate, stopDate);

    return NextResponse.json(bloomYardScrapped);
  } catch (error) {
    console.error("Error fetching bloom yard scrapped:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard scrapped" },
      { status: 500 }
    );
  }
}
