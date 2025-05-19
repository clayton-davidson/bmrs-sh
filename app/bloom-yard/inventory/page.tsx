import { InventoryTable } from "@/features/bloom-yard/components/InventoryTable/InventoryTable";
import { getBloomYardInventory } from "@/features/bloom-yard/server/db/bloom-yard";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bloom Yard Inventory",
};

export default function BloomYardInventory() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["bloom-yard/inventory"],
    queryFn: getBloomYardInventory,
  });

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InventoryTable />
      </HydrationBoundary>
    </Suspense>
  );
}
