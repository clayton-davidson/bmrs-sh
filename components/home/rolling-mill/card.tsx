"use client";

import { RollingMillModel } from "@/types/home/rolling-mill-model";
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

export function RollingMillCard() {
  const { data } = useSuspenseQuery<RollingMillModel[], Error>({
    queryKey: ["rolling-mill"],
    queryFn: async () => {
      const response = await fetch("/api/home/rolling-mill");
      return response.json();
    },
    refetchInterval: 60000,
  });

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Current Rolling</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Product</TableHead>
                <TableHead className="text-center">Required Weight</TableHead>
                <TableHead className="text-center">Rolled Weight</TableHead>
                <TableHead className="text-center">
                  Weight Change - TPH
                </TableHead>
                <TableHead className="text-center">
                  Weight Change - Pace
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.PRODUCTSIZE}>
                  <TableCell className="text-center font-semibold">
                    {row.PRODUCTSIZE}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.REQUIREDWEIGHT}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.ROLLEDWEIGHT}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.TPHWC} hrs.
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.TPHPACE} hrs.
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
