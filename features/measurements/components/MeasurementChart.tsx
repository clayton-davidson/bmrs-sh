"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Measurement, MeasurementType } from "../schemas/measurements";
import { LineChart, Line, XAxis, CartesianGrid, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

interface MeasurementChartProps {
  data: Measurement[];
  measurementType: MeasurementType | null;
  timeRange: number;
  color: string;
}

export default function MeasurementChart({
  data,
  measurementType,
  color,
  timeRange,
}: MeasurementChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-center text-gray-500">
            No data available for the selected time range
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.takenAt).toISOString(),
    reading: item.reading,
  }));

  const chartConfig = {
    reading: {
      label: measurementType?.name || "Measurement",
      color: color,
    },
  } satisfies ChartConfig;

  const formatXAxis = (value: string): string => {
    const date = new Date(value);
    if (timeRange <= 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatXAxis}
            />
            <YAxis
              label={{
                value: measurementType?.unit || "",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
                dx: -10,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px] shadow-md"
                  nameKey="reading"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return [
                      `${Number(value).toFixed(3)} ${
                        measurementType?.unit || ""
                      }`,
                    ];
                  }}
                />
              }
            />
            <Line
              dataKey="reading"
              type="monotone"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              stroke={color}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
