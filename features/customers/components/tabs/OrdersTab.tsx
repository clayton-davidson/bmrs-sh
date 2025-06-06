"use client";

import { format } from "date-fns";
import type { ProcessedCustomerData } from "../../schemas/customers";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface OrdersTabProps {
  customerData: ProcessedCustomerData;
}

export const OrdersTab = ({ customerData }: OrdersTabProps) => {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base">Order History</CardTitle>
        <CardDescription>Monthly breakdown of orders</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full">
          <div className="px-6 pb-4">
            {customerData.orderEntries.length > 0 ? (
              customerData.orderEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2 last:border-0 hover:bg-muted/20 p-2 rounded-sm transition-colors"
                >
                  <div className="font-medium">
                    {format(new Date(entry.orderDate), "MMMM yyyy")}
                  </div>
                  <Badge variant="secondary">
                    {entry.tons.toFixed(2)} tons
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No order history available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
