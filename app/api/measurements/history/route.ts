import { NextRequest, NextResponse } from "next/server";
import { getMeasurementHistory } from "@/features/measurements/server/db/measurements";
import { parseAsIsoDateTime, createLoader, parseAsInteger } from "nuqs/server";

const params = {
  typeId: parseAsInteger.withDefault(0),
  fromTime: parseAsIsoDateTime.withDefault(new Date()),
};

const loadSearchParams = createLoader(params);

export async function GET(request: NextRequest) {
  try {
    const { typeId, fromTime } = loadSearchParams(request.url);

    if (!typeId || !fromTime) {
      return NextResponse.json(
        { error: "Missing required parameters: typeId and fromTime" },
        { status: 400 }
      );
    }

    const data = await getMeasurementHistory(typeId, fromTime);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching measurement history:", error);
    return NextResponse.json(
      { error: "Failed to fetch measurement history" },
      { status: 500 }
    );
  }
}
