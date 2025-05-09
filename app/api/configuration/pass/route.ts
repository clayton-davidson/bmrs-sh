import { NextResponse } from "next/server";
import { getPasses } from "@/lib/data/configuration/pass";

export async function GET() {
  const items = await getPasses();

  return NextResponse.json(items);
}
