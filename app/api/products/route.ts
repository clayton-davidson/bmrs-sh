import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/configuration/product";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products data:", error);
    return NextResponse.json(
      { error: "Failed to fetch products data" },
      { status: 500 }
    );
  }
}
