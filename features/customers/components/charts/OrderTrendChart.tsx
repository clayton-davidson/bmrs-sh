"use client";

import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { OrderEntry } from "../../schemas/customers";

interface OrderTrendChartProps {
  orderEntries: OrderEntry[];
}

const chartConfig = {
  tons: {
    label: "Tons",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const OrderTrendChart = ({ orderEntries }: OrderTrendChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Order Trend</CardTitle>
        <CardDescription>Monthly order volume in tons</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: "275px", width: "100%" }}
        >
          <LineChart
            accessibilityLayer
            data={orderEntries}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis
              dataKey="orderDate"
              tickFormatter={(date) => format(new Date(date), "MMM yyyy")}
            />
            <YAxis tickFormatter={(value) => `${value}`} width={45} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="tons"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};