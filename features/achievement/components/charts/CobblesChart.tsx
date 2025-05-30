"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { NumberOverBarHorizontalLabel } from "./labels/NumberOverBarLabel";

interface CobblesModel {
  crew: string;
  cobbles: number;
}

interface CobblesChartProps {
  data: CobblesModel[];
}

export function CobblesChart({ data }: CobblesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-center text-muted-foreground">
            No cobbles data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    cobbles: {
      label: "Cobbles",
      color: "green",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            domain={[0, Math.max(...data.map((d) => d.cobbles)) + 2]}
            label={{
              value: "Cobbles (Goal: ≤ 110)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            type="category"
            dataKey="crew"
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ReferenceLine
            x={110}
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
            label={{ value: "Goal", position: "top" }}
          />
          <Bar
            dataKey="cobbles"
            name="cobbles"
            fill="var(--color-cobbles)"
            radius={[0, 2, 2, 0]}
          >
            <LabelList content={<NumberOverBarHorizontalLabel />} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
