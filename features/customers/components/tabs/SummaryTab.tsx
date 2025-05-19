"use client";

import { ProcessedCustomerData } from "../../schemas/customers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderTrendChart } from "../charts/OrderTrendChart";

interface SummaryTabProps {
  customerData: ProcessedCustomerData;
  onViewProducts: () => void;
}

export const SummaryTab = ({
  customerData,
  onViewProducts,
}: SummaryTabProps) => {
  const getFulfillmentColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 80) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-sm text-muted-foreground">
                  Tons Ordered
                </div>
                <div className="text-2xl font-bold">
                  {customerData.tonsOrderedPastYear.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Tons Shipped
                </div>
                <div className="text-2xl font-bold">
                  {customerData.tonsShippedPastYear.toFixed(2)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Fulfillment Rate
              </div>
              <div
                className={`text-2xl font-bold ${
                  customerData.fulfillmentRate
                    ? getFulfillmentColor(
                        parseFloat(customerData.fulfillmentRate)
                      )
                    : ""
                }`}
              >
                {customerData.fulfillmentRate || "0"}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="space-y-2">
              {customerData.breakdownBySection
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="truncate max-w-[70%]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="font-medium text-sm cursor-help">
                              {item.product || "Unknown"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="text-sm">
                              {item.product || "Unknown"}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm">{item.tons.toFixed(2)} tons</div>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto"
              onClick={onViewProducts}
            >
              <span>View all products</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <OrderTrendChart orderEntries={customerData.orderEntries} />
    </div>
  );
};