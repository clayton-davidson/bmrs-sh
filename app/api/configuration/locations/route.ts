import { NextResponse } from "next/server";
import { getLocations } from "@/lib/data/configuration/location";

export async function GET() {
  const data = await getLocations();

  return NextResponse.json(data);
}
