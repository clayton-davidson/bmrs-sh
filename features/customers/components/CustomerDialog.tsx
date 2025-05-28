"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Customer } from "../schemas/customers";
import { processCustomerData } from "../utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeInfo, PackageOpen, CalendarDays } from "lucide-react";

import { CustomerHeader } from "./CustomerHeader";
import { SummaryTab } from "./tabs/SummaryTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { OrdersTab } from "./tabs/OrdersTab";

export const CustomerDialog = ({ customer }: { customer: Customer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const {
    data: orders,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers/orders", customer.CUSTOMER],
    queryFn: async () => {
      const response = await fetch(
        `/api/customers/orders?customerId=${customer.CUSTOMER}`
      );

      return response.json();
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const customerData = orders ? processCustomerData(orders, customer) : null;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-1"
          onClick={() => setIsOpen(true)}
        >
          <BadgeInfo className="h-4 w-4" />
          <span>Details</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1200px] w-[95vw] overflow-hidden p-0">
        <div className="p-4 pb-2">
          <CustomerHeader customer={customer} />
        </div>

        {isLoading || isFetching ? (
          <div className="p-4 space-y-4">
            <div className="h-36 w-full bg-muted animate-pulse rounded" />
          </div>
        ) : isError ? (
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-red-500 mb-2">
              Error loading customer data: {(error as Error).message}
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : !customerData ? (
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">
              No data available for this customer
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="px-4">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="summary">
                    <span className="flex items-center gap-1">
                      <BadgeInfo className="h-4 w-4" />
                      <span>Summary</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="products">
                    <span className="flex items-center gap-1">
                      <PackageOpen className="h-4 w-4" />
                      <span>Products</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Order History</span>
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="max-h-[80vh] overflow-auto px-4 pb-4">
                <TabsContent value="summary" className="mt-0 w-full">
                  <SummaryTab
                    customerData={customerData}
                    onViewProducts={() => handleTabChange("products")}
                  />
                </TabsContent>

                <TabsContent value="products" className="mt-0 w-full">
                  <ProductsTab customerData={customerData} />
                </TabsContent>

                <TabsContent value="orders" className="mt-0 w-full">
                  <OrdersTab customerData={customerData} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
