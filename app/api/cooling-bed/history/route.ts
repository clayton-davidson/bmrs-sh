import { getCoolingBedHistory } from "@/features/cooling-bed/server/db/cooling-bed";
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

    const coolingBedHistory = await getCoolingBedHistory(startDate, stopDate);

    return NextResponse.json(coolingBedHistory);
  } catch (error) {
    console.error("Error fetching cooling bed history:", error);

    return NextResponse.json(
      { error: "Failed to fetch cooling bed history" },
      { status: 500 }
    );
  }
}
