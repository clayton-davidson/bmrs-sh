"use client";

import { useQuery } from "@tanstack/react-query";

export function RollShopNotes({
  startDate,
  stopDate,
}: {
  startDate: Date;
  stopDate: Date;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["morning-meeting/roll-shop-notes", startDate, stopDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/morning-meeting/roll-shop-notes?startDate=${startDate}&stopDate=${stopDate}`
      );
      return response.json();
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Roll Shop</h2>
      <div className="w-full text-wrap border text-center">
        <div className="p-3">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-accent rounded mb-2"></div>
              <div className="h-4 bg-accent rounded mb-2"></div>
              <div className="h-4 bg-accent rounded mb-2"></div>
            </div>
          ) : (
            data
          )}
        </div>
      </div>
    </div>
  );
}
