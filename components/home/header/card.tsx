"use client";

import { HeaderModel } from "@/types/home/header-model";
import { RollingMillModel } from "@/types/home/rolling-mill-model";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";

export function HeaderCard() {
  const { data } = useSuspenseQuery<HeaderModel, Error>({
    queryKey: ["header"],
    queryFn: async () => {
      const response = await fetch("/api/home/header");
      return response.json();
    },
    refetchInterval: 10000,
  });

  const { data: rollingData } = useSuspenseQuery<RollingMillModel[], Error>({
    queryKey: ["rolling-mill"],
    queryFn: async () => {
      const response = await fetch("/api/home/rolling-mill");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const {
    crew,
    currentRolling,
    rolledTons,
    projectedBonus,
    tph,
    millPace,
    lastBarTimer,
    limitingArea,
  } = data;

  const tphPace = rollingData.reduce(
    (accumulator, current) => accumulator + current.TPHPACE,
    0
  );

  const tphWC = rollingData.reduce(
    (accumulator, current) => accumulator + current.TPHWC,
    0
  );

  return (
    <Card>
      <CardContent className="p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-4">
          <div className="text-center font-semibold">Crew: {crew}</div>
          <div className="text-center font-semibold">
            Rolling: {currentRolling}
          </div>
          <div className="text-center font-semibold">
            Rolled Tons: {rolledTons}
          </div>
          <div className="text-center font-semibold">
            Projected Bonus: {projectedBonus}
          </div>
          <div className="text-center font-semibold">TPH: {tph}</div>
          <div className="text-center font-semibold">Mill Pace: {millPace}</div>
          <div className="text-center font-semibold lg:col-span-2">
            Last Bar Timer: {lastBarTimer}
          </div>
          <div className="text-center font-semibold lg:col-span-3">
            Est. Roll Change by TPH: {tphWC} hrs., By Pace: {tphPace} hrs.
          </div>
          <div className="text-center font-semibold">
            Limiting Area: {limitingArea}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-xl font-semibold">
          🚨 See Something, Say Something, Courage Saves Lives 🚨
        </div>
      </CardFooter>
    </Card>
  );
}
