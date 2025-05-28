"use client";

import type { ProcessedCustomerData } from "../../schemas/customers";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductDistributionChart } from "../charts/ProductDistributionChart";

interface ProductsTabProps {
  customerData: ProcessedCustomerData;
}

export const ProductsTab = ({ customerData }: ProductsTabProps) => {
  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="w-full">
        <ProductDistributionChart
          products={customerData.breakdownBySection.slice(0, 10)}
        />
      </div>

      <Card className="flex-1 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Products</CardTitle>
          <CardDescription>Complete product breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[200px]">
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customerData.breakdownBySection.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="font-medium truncate mb-1 text-sm">
                      {item.product || "Unknown"}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Tons
                        </div>
                        <div>{item.tons.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Bundles
                        </div>
                        <div>{item.bundlesOrdered}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
