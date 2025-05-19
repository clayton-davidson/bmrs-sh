"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function LastSixBarsToTheBedCardSkeleton() {
  const skeletonRows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Card className="mt-2">
      <CardHeader>
        <Skeleton className="h-6 w-64" />
      </CardHeader>
      <CardContent className="px-6">
        <div className="mb-4">
          <Skeleton className="h-5 w-40" />{" "}
        </div>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-20 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-12 mx-auto" />
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
