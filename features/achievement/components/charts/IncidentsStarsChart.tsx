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
import { NumberOverBarVerticalLabel } from "./labels/NumberOverBarLabel";
import { IncidentEditModel, StarsByCrewModel } from "@/lib/api/types.gen";

interface IncidentsStarsChartProps {
  incidents: IncidentEditModel | undefined;
  stars: StarsByCrewModel[];
}

export function IncidentsStarsChart({
  incidents,
  stars,
}: IncidentsStarsChartProps) {
  if (!incidents || stars.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-center text-muted-foreground">
          No incidents or stars data available
        </p>
      </div>
    );
  }

  const chartData = [
    {
      crew: "A",
      incidents: incidents.aCrew || 0,
      stars: stars.find((star) => star.crew === "A")?.starCount || 0,
    },
    {
      crew: "B",
      incidents: incidents.bCrew || 0,
      stars: stars.find((star) => star.crew === "B")?.starCount || 0,
    },
    {
      crew: "C",
      incidents: incidents.cCrew || 0,
      stars: stars.find((star) => star.crew === "C")?.starCount || 0,
    },
    {
      crew: "D",
      incidents: incidents.dCrew || 0,
      stars: stars.find((star) => star.crew === "D")?.starCount || 0,
    },
    {
      crew: "Day",
      incidents: incidents.dayCrew || 0,
      stars: stars.find((star) => star.crew === "Day")?.starCount || 0,
    },
  ];

  const chartConfig = {
    incidents: {
      label: "Incidents",
      color: "red",
    },
    stars: {
      label: "STARS",
      color: "green",
    },
  } satisfies ChartConfig;

  const maxIncidents = Math.max(...chartData.map((d) => d.incidents));
  const maxStars = Math.max(...chartData.map((d) => d.stars));

  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="crew"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis
            yAxisId="incidents"
            orientation="left"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            domain={[0, maxIncidents + 2]}
            label={{
              value: "Incident Count",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            yAxisId="stars"
            orientation="right"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            domain={[0, maxStars + Math.ceil(maxStars * 0.1)]}
            label={{
              value: "STAR Count",
              angle: 90,
              position: "insideRight",
              style: { textAnchor: "middle" },
            }}
          />
          <ChartLegend
            content={<ChartLegendContent />}
            wrapperStyle={{ paddingTop: "20px" }}
          />
          <Bar
            yAxisId="incidents"
            dataKey="incidents"
            name="Incidents"
            fill="var(--color-incidents)"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            <LabelList content={<NumberOverBarVerticalLabel />} />
          </Bar>
          <Bar
            yAxisId="stars"
            dataKey="stars"
            name="STARS"
            fill="var(--color-stars)"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            <LabelList content={<NumberOverBarVerticalLabel />} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
