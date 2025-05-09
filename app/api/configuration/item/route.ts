import { NextResponse } from "next/server";
import { getItems } from "@/lib/data/configuration/item";

export async function GET() {
  const items = await getItems();

  return NextResponse.json(items);
}
