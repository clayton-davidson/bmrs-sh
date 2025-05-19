import { getBloomYardStart } from "@/features/bloom-yard/server/db/bloom-yard";
import { NextRequest, NextResponse } from "next/server";
import { parseAsIsoDateTime, createLoader } from "nuqs/server";

const params = {
  startDate: parseAsIsoDateTime.withDefault(new Date(0)),
};

const loadSearchParams = createLoader(params);

export async function GET(request: NextRequest) {
  try {
    const { startDate } = loadSearchParams(request.url);

    const bloomYardStart = await getBloomYardStart(startDate);

    return NextResponse.json(bloomYardStart);
  } catch (error) {
    console.error("Error fetching bloom yard start:", error);

    return NextResponse.json(
      { error: "Failed to fetch bloom yard start" },
      { status: 500 }
    );
  }
}
