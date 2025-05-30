"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { NumberOverBarHorizontalLabel } from "./labels/NumberOverBarLabel";

interface YieldByCrewModel {
  crew: string;
  weeklyYield: number;
  ytdYield: number;
}

interface YieldChartProps {
  data: YieldByCrewModel[];
}

export function YieldChart({ data }: YieldChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-center text-muted-foreground">
            No yield data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    weeklyYield: {
      label: "Weekly Yield",
      color: "green",
    },
    ytdYield: {
      label: "YTD Average",
      color: "blue",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[60, 110]}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="crew"
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Bar
            dataKey="weeklyYield"
            name="weeklyYield"
            fill="var(--color-weeklyYield)"
            radius={[0, 2, 2, 0]}
          >
            <LabelList content={<NumberOverBarHorizontalLabel />} />
          </Bar>
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="ytdYield"
            name="ytdYield"
            fill="var(--color-ytdYield)"
            radius={[0, 2, 2, 0]}
          >
            <LabelList content={<NumberOverBarHorizontalLabel />} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
