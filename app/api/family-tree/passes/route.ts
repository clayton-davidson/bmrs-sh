import { NextRequest, NextResponse } from "next/server";
import { getFamilyTreePasses } from "@/lib/data/configuration/family-tree";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyTreeId = Number(searchParams.get("familyTreeId"));

    if (!familyTreeId) {
      return NextResponse.json(
        { error: "Family Tree ID is required" },
        { status: 400 }
      );
    }

    const familyTreeData = await getFamilyTreePasses(familyTreeId);

    return NextResponse.json(familyTreeData);
  } catch (error) {
    console.error("Error fetching family tree passes:", error);
    return NextResponse.json(
      { error: "Failed to fetch family tree passes" },
      { status: 500 }
    );
  }
}
