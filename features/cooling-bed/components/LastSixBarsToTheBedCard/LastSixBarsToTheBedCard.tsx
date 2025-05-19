"use client";

import { type MinimalCoolingBed } from "@/features/cooling-bed/schemas/cooling-bed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export function LastSixBarsToTheBedCard() {
  const { data } = useSuspenseQuery<
    { barCount: number; bars: MinimalCoolingBed[] },
    Error
  >({
    queryKey: ["cooling-bed"],
    queryFn: async () => {
      const response = await fetch("/api/home/cooling-bed");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const { barCount, bars } = data || { barCount: 0, bars: [] };

  const getWeightDeltaClasses = (delta: number) => {
    if (delta >= 50 && Math.abs(delta) <= 300) {
      return "bg-red-500 text-white";
    } else if (delta <= -50 && Math.abs(delta) <= 300) {
      return "bg-orange-500 text-white";
    } else if (delta >= 300) {
      return "bg-yellow-400 text-black";
    }
    return "";
  };

  const getWeightDeltaValue = (delta: number) => {
    return delta >= 300 ? "N/A" : delta;
  };

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Cooling Bed Summary ({barCount} bars)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="mb-4">
          <p className="font-semibold text-sm">Last 6 bars to the bed:</p>
        </div>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Seq</TableHead>
                <TableHead className="text-center">Product</TableHead>
                <TableHead className="text-center">Heat</TableHead>
                <TableHead className="text-center">Length</TableHead>
                <TableHead className="text-center">RHF Tmp</TableHead>
                <TableHead className="text-center">F Tmp</TableHead>
                <TableHead className="text-center">Crew</TableHead>
                <TableHead className="text-center">Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bars.map((row) => (
                <TableRow key={row.MULT_ID}>
                  <TableCell className="text-center font-semibold">
                    {row.SEQ}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.PROD_SIZE}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.HEAT_ID}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.MULT_LEN}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.RHF_TEMP}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.TMP_F}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.CREW}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center font-semibold",
                      getWeightDeltaClasses(row.WEIGHT_DELTA)
                    )}
                  >
                    {getWeightDeltaValue(row.WEIGHT_DELTA)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
