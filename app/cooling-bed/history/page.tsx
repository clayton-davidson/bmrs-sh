import { HistoryTable } from "@/features/cooling-bed/components/HistoryTable/HistoryTable";
import { getCoolingBedHistory } from "@/features/cooling-bed/server/db/cooling-bed";
import { shiftSearchParamsCache } from "@/lib/utils"
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cooling Bed History",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryClient = getQueryClient();

  const { startDate, stopDate } = shiftSearchParamsCache.parse(params);

  queryClient.prefetchQuery({
    queryKey: ["cooling-bed/history", startDate, stopDate],
    queryFn: () => getCoolingBedHistory(startDate, stopDate),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryTable initialStartDate={startDate} initialStopDate={stopDate} />
    </HydrationBoundary>
  );
}
