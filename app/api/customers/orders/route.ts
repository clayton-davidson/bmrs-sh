import { NextResponse, NextRequest } from "next/server";
import { getCustomerOrders } from "@/features/customers/server/db/customers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customerId = Number(searchParams.get("customerId"));

  if (!customerId || Array.isArray(customerId)) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  try {
    const orders = await getCustomerOrders(Number(customerId));
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer orders" },
      { status: 500 }
    );
  }
}
