import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { getCustomers } from "@/features/customers/server/db/customers";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerTable />
      </HydrationBoundary>
    </Suspense>
  );
}
