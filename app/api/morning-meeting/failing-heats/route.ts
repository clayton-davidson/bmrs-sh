import { getFailingHeats } from "@/features/morning-meeting/server/db/morning-meeting";
import { NextRequest, NextResponse } from "next/server";
import { createLoader, parseAsInteger } from "nuqs/server";

const params = {
  as400StartDate: parseAsInteger.withDefault(0),
  as400StartDateTime: parseAsInteger.withDefault(0),
  as400StopDateTime: parseAsInteger.withDefault(0),
};

const loadSearchParams = createLoader(params);

export async function GET(request: NextRequest) {
  try {
    const { as400StartDate, as400StartDateTime, as400StopDateTime } =
      loadSearchParams(request.url);

    const failingHeats = await getFailingHeats(
      as400StartDate,
      as400StartDateTime,
      as400StopDateTime
    );

    return NextResponse.json(failingHeats);
  } catch (error) {
    console.error("Error fetching failing heats:", error);

    return NextResponse.json(
      { error: "Failed to fetch failing heats" },
      { status: 500 }
    );
  }
}
