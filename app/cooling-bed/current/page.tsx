import { CurrentTable } from "@/features/cooling-bed/components/CurrentTable/CurrentTable";
import { getCurrentCoolingBed } from "@/features/cooling-bed/server/db/cooling-bed";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Current Cooling Bed",
};

export default function CurrentBed() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["cooling-bed/current"],
    queryFn: getCurrentCoolingBed,
  });

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CurrentTable />
      </HydrationBoundary>
    </Suspense>
  );
}
