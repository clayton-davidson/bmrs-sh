import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { RollingMillCard } from "./card";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { getRollings } from "@/lib/data/home/rolling-mill";

export default async function RollingMillContainer() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["rolling-mill"],
    queryFn: getRollings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RollingMillCard />
    </HydrationBoundary>
  );
}
