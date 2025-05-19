import { getBloomYardBalance } from "@/features/bloom-yard/server/db/bloom-yard";
import { shiftSearchParamsCache } from "@/lib/utils";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";
import ReconciliationTabs from "@/features/bloom-yard/components/ReconcilationTabs/ReconciliationTabs";

export const metadata: Metadata = {
  title: "Bloom Yard Reconciliation",
};

export default async function BloomYardReconciliation({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryClient = getQueryClient();

  const { startDate, stopDate } = shiftSearchParamsCache.parse(params);

  queryClient.prefetchQuery({
    queryKey: ["bloom-yard/reconciliation/balance", startDate, stopDate],
    queryFn: () => getBloomYardBalance(startDate, stopDate),
  });

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReconciliationTabs
          initialStartDate={startDate}
          initialStopDate={stopDate}
        />
      </HydrationBoundary>
    </Suspense>
  );
}
