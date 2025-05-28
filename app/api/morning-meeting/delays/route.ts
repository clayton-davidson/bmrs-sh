import { getDelays } from "@/features/morning-meeting/server/db/morning-meeting";
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

    const morningMeetingDelays = await getDelays(startDate, stopDate);

    return NextResponse.json(morningMeetingDelays);
  } catch (error) {
    console.error("Error fetching morning meeting delays:", error);

    return NextResponse.json(
      { error: "Failed to fetch morning meeting delays" },
      { status: 500 }
    );
  }
}
