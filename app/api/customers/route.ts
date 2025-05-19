import { NextResponse } from "next/server";
import { getCustomers } from "@/features/customers/server/db/customers";

export async function GET() {
  try {
    const customerData = await getCustomers();
    return NextResponse.json(customerData);
  } catch (error) {
    console.error("Error fetching customer data:", error);

    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
