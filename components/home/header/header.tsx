import { getHeaderData } from "@/lib/data/home/header";
import { HeaderCard } from "./card";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getRollings } from "@/lib/data/home/rolling-mill";

export async function Header() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["header"],
    queryFn: getHeaderData,
  });

  queryClient.prefetchQuery({
    queryKey: ["rolling-mill"],
    queryFn: getRollings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeaderCard />
    </HydrationBoundary>
  );
}
