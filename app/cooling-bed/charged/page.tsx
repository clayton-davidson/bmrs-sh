import { ChargedTable } from "@/features/cooling-bed/components/ChargedTable/ChargedTable";
import { getChargedCoolingBed } from "@/features/cooling-bed/server/db/cooling-bed";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cooling Bed Charged",
};

export default function CurrentBed() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["cooling-bed/charged"],
    queryFn: getChargedCoolingBed,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChargedTable />
    </HydrationBoundary>
  );
}
