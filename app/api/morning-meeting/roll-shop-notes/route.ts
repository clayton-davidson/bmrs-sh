import { getRollShopNotes } from "@/features/morning-meeting/server/db/morning-meeting";
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

    const rollShopNotes = await getRollShopNotes(startDate, stopDate);

    return NextResponse.json(rollShopNotes);
  } catch (error) {
    console.error("Error fetching roll shop notes:", error);

    return NextResponse.json(
      { error: "Failed to fetch roll shop notes" },
      { status: 500 }
    );
  }
}
