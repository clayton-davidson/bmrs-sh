"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

interface RunningBonusModel {
  crew: string;
  runningBonus: number;
  totalHours?: number;
}

interface ProductionBonusChartProps {
  actualBonus: RunningBonusModel[];
  theoreticalBonus: RunningBonusModel[];
}

export function ProductionBonusChart({
  actualBonus,
  theoreticalBonus,
}: ProductionBonusChartProps) {
  if (!actualBonus || actualBonus.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-center text-muted-foreground">
            No production bonus data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = actualBonus.map((actual) => {
    const theoretical = theoreticalBonus.find((t) => t.crew === actual.crew);
    return {
      crew: actual.crew,
      actual: actual.runningBonus,
      theoretical: theoretical?.runningBonus || 0,
    };
  });

  const chartConfig = {
    actual: {
      label: "Actual Bonus",
      color: "green",
    },
    theoretical: {
      label: "Theoretical Bonus",
      color: "blue",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart layout="vertical" data={chartData} margin={{ left: 15 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            domain={[0, 300]}
            label={{
              value: "Bonus %",
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
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="actual"
            name="actual"
            fill="var(--color-actual)"
            radius={[0, 2, 2, 0]}
          >
            <LabelList content={<NumberOverBarHorizontalLabel />} />
          </Bar>
          <Bar
            dataKey="theoretical"
            name="theoretical"
            fill="var(--color-theoretical)"
            radius={[0, 2, 2, 0]}
          >
            <LabelList content={<NumberOverBarHorizontalLabel />} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
