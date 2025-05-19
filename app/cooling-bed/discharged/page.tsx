import { DischargedTable } from "@/features/cooling-bed/components/DischargedTable/DischargedTable";
import { getDischargedCoolingBed } from "@/features/cooling-bed/server/db/cooling-bed";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cooling Bed Discharged",
};

export default function CurrentBed() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["cooling-bed/discharged"],
    queryFn: getDischargedCoolingBed,
  });

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DischargedTable />
      </HydrationBoundary>
    </Suspense>
  );
}
