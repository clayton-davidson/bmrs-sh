import { NextRequest, NextResponse } from "next/server";
import { getFamilyTree } from "@/lib/data/configuration/family-tree";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = Number(searchParams.get("productId"));

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const familyTreeData = await getFamilyTree(productId);

    return NextResponse.json(familyTreeData);
  } catch (error) {
    console.error("Error fetching family tree data:", error);
    return NextResponse.json(
      { error: "Failed to fetch family tree data" },
      { status: 500 }
    );
  }
}
