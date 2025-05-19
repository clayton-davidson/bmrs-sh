"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "../schemas/customers";
import { processCustomerData } from "../utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeInfo, PackageOpen, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { CustomerHeader } from "./CustomerHeader";
import { SummaryTab } from "./tabs/SummaryTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { OrdersTab } from "./tabs/OrdersTab";

export const CustomerDialog = ({ customer }: { customer: Customer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const {
    data: orders,
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
      if (!response.ok) {
        throw new Error("Failed to fetch customer orders");
      }
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
        if (open) refetch();
      }}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <BadgeInfo className="h-4 w-4" />
        <span>Details</span>
      </Button>

      <DialogContent className="sm:max-w-3xl">
        <CustomerHeader customer={customer} />

        {isFetching ? (
          <div className="space-y-4">
            <Skeleton className="h-[125px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-red-500 mb-2">
              Error loading customer data: {(error as Error).message}
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : !customerData ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
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
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary" data-value="summary">
                <span className="flex items-center gap-1">
                  <BadgeInfo className="h-4 w-4" />
                  <span>Summary</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="products" data-value="products">
                <span className="flex items-center gap-1">
                  <PackageOpen className="h-4 w-4" />
                  <span>Products</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="orders" data-value="orders">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Order History</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="min-h-[500px]">
              <SummaryTab
                customerData={customerData}
                onViewProducts={() => handleTabChange("products")}
              />
            </TabsContent>

            <TabsContent value="products" className="min-h-[500px]">
              <ProductsTab customerData={customerData} />
            </TabsContent>

            <TabsContent value="orders" className="min-h-[500px]">
              <OrdersTab customerData={customerData} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};