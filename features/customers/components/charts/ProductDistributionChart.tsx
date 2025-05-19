"use client";

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
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ProductBreakdown } from "../../schemas/customers";

interface ProductDistributionChartProps {
  products: ProductBreakdown[];
}

const chartConfig = {
  tons: {
    label: "Tons",
    color: "#6366f1",
  },
  bundles: {
    label: "Bundles",
    color: "#10b981",
  },
} satisfies ChartConfig;

export const ProductDistributionChart = ({
  products,
}: ProductDistributionChartProps) => {
  const customTooltipFormatter = (value: any, name: string) => {
    if (name === "tons") return [`${value.toFixed(2)} tons`, "Volume"];
    if (name === "bundlesOrdered") return [`${value} bundles`, "Quantity"];
    return [value, name];
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Product Distribution</CardTitle>
        <CardDescription>
          Top {products.length} products by volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: "275px", width: "100%" }}
        >
          <BarChart
            data={products}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="product"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value
                  ? value.length > 10
                    ? value.substring(0, 10) + "..."
                    : value
                  : "Unknown"
              }
              height={60}
            />
            <YAxis width={45} />
            <ChartTooltip formatter={customTooltipFormatter} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar
              dataKey="tons"
              fill="#6366f1"
              name="Tons"
              isAnimationActive={true}
              animationDuration={800}
            />
            <Bar
              dataKey="bundlesOrdered"
              fill="#10b981"
              name="Bundles"
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={200}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};