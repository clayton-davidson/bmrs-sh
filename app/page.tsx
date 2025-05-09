import { StandsDisplay } from "@/components/home/stands-display";
import { getActiveProductPlan } from "@/lib/data/mill/planning";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | BMRS",
};

export default function Home() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["active-product-plan"],
    queryFn: getActiveProductPlan,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StandsDisplay />
    </HydrationBoundary>
  );
}
