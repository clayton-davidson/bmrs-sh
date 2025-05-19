"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RollingMillSkeleton() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Current Rolling</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[250px] p-6">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-b-lg" />
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
