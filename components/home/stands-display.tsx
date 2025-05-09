"use client";

import { MillPlanCard } from "@/components/home/mill-plan-card";
import { ActiveLineup } from "@/types/home/active-lineup";
import { useSuspenseQuery } from "@tanstack/react-query";

export function StandsDisplay() {
  const { data: millPlans } = useSuspenseQuery<ActiveLineup[]>({
    queryKey: ["active-product-plan"],
    queryFn: async () => {
      const request = await fetch("/api/mill/active-product-plan");
      return await request.json();
    },
  });

  return (
    <div className="m-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {millPlans.map((millPlan) => (
          <MillPlanCard
            key={`${millPlan.stand}-${millPlan.setId}`}
            millPlan={millPlan}
          />
        ))}
      </div>
    </div>
  );
}
