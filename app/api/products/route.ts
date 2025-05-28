import { NextResponse } from "next/server";
import { getProducts } from "@/features/products/server/db/product";

export async function GET() {
  try {
    const productData = await getProducts();
    return NextResponse.json(productData);
  } catch (error) {
    console.error("Error fetching product data:", error);

    return NextResponse.json(
      { error: "Failed to fetch product data" },
      { status: 500 }
    );
  }
}
