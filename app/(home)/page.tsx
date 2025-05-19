import { Header } from "@/components/home/header/header";
import HeaderSkeleton from "@/components/home/header/skeleton";
import RollingMillContainer from "@/components/home/rolling-mill/container";
import RollingMillSkeleton from "@/components/home/rolling-mill/skeleton";
import StandsDisplay from "@/components/home/stand-display/stands-display";
import { LastSixBarsToTheBedCard } from "@/features/cooling-bed/components/LastSixBarsToTheBedCard/LastSixBarsToTheBedCard";
import { LastSixBarsToTheBedCardSkeleton } from "@/features/cooling-bed/components/LastSixBarsToTheBedCard/LastSixBarsToTheBedCardSkeleton";
import { getCoolingBedData } from "@/features/cooling-bed/server/db/cooling-bed";
import { getQueryClient } from "@/lib/misc/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["cooling-bed"],
    queryFn: getCoolingBedData,
  });

  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <StandsDisplay />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="h-auto">
          <Suspense fallback={<RollingMillSkeleton />}>
            <RollingMillContainer />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<LastSixBarsToTheBedCardSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <LastSixBarsToTheBedCard />
            </HydrationBoundary>
          </Suspense>
        </div>
      </div>
    </>
  );
}
