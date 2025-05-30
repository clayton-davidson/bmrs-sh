"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MeasurementChart from "./MeasurementChart";
import { getColorForLevel } from "../utils/color-helpers";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowRight,
  BarChart3,
  LineChart,
} from "lucide-react";
import { MeasurementModel, MeasurementTypeModel } from "@/lib/api";
import { getHistoricalMeasurementsOptions } from "@/lib/api/@tanstack/react-query.gen";

const timeRangeOptions = [
  { text: "Last Hour", value: 1 },
  { text: "Last 4 Hours", value: 4 },
  { text: "Last 12 Hours", value: 12 },
  { text: "Last 24 Hours", value: 24 },
  { text: "Last 3 Days", value: 72 },
  { text: "Last Week", value: 168 },
  { text: "Last 3 Months", value: 168 * 12 },
];

interface MeasurementDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurementType: MeasurementTypeModel;
}

export default function MeasurementDetailsDialog({
  open,
  onOpenChange,
  measurementType,
}: MeasurementDetailsDialogProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(24);
  const [viewMode, setViewMode] = useState<"chart" | "stats">("chart");

  const fromTime = useMemo(
    () =>
      measurementType
        ? dayjs().subtract(selectedTimeRange, "hour").toISOString()
        : null,
    [measurementType?.id, selectedTimeRange]
  );

  const { data: historicalReadings = [], isLoading: isHistoricalLoading } =
    useQuery({
      ...getHistoricalMeasurementsOptions({
        path: { typeId: measurementType?.id ?? 0 },
        query: { fromTime: fromTime || undefined },
      }),
      enabled: !!measurementType && !!fromTime && open,
      refetchInterval: 60000,
    });

  const handleTimeRangeChange = (value: string): void => {
    const hours = parseInt(value, 10);
    setSelectedTimeRange(hours);
  };

  const stats = useMemo(() => {
    if (!historicalReadings || historicalReadings.length === 0) {
      return {
        current: 0,
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        stdDev: 0,
        trend: "neutral" as const,
        percentChange: 0,
      };
    }

    const validReadings = historicalReadings.filter(
      (r): r is MeasurementModel & { reading: number } =>
        r != null && typeof r.reading === "number" && !isNaN(r.reading)
    );

    if (validReadings.length === 0) {
      return {
        current: 0,
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        stdDev: 0,
        trend: "neutral" as const,
        percentChange: 0,
      };
    }

    const readings = validReadings.map((r) => r.reading);

    const sortedReadings = [...readings].sort((a, b) => {
      const numA = a ?? 0;
      const numB = b ?? 0;
      return numA - numB;
    });

    const mid = Math.floor(sortedReadings.length / 2);
    const median =
      sortedReadings.length % 2 !== 0
        ? sortedReadings[mid] ?? 0
        : ((sortedReadings[mid - 1] ?? 0) + (sortedReadings[mid] ?? 0)) / 2;

    const avg =
      readings.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0) /
      readings.length;
    const squareDiffs = readings.map((value) => {
      const safeValue = value ?? 0;
      const diff = safeValue - avg;
      return diff * diff;
    });
    const avgSquareDiff =
      squareDiffs.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0) /
      squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    const quarter = Math.max(1, Math.floor(validReadings.length / 4));
    const earlyReadings = validReadings.slice(0, quarter);
    const lateReadings = validReadings.slice(-quarter);

    const earlyAvg =
      earlyReadings.reduce((sum, r) => sum + (r.reading ?? 0), 0) /
      earlyReadings.length;
    const lateAvg =
      lateReadings.reduce((sum, r) => sum + (r.reading ?? 0), 0) /
      lateReadings.length;

    const percentChange =
      earlyAvg !== 0 ? ((lateAvg - earlyAvg) / earlyAvg) * 100 : 0;

    let trend: "up" | "down" | "neutral" = "neutral";
    if (percentChange > 1) trend = "up";
    else if (percentChange < -1) trend = "down";

    return {
      current: validReadings[validReadings.length - 1]?.reading ?? 0,
      min: Math.min(...readings.map((r) => r ?? 0)),
      max: Math.max(...readings.map((r) => r ?? 0)),
      avg,
      median,
      stdDev,
      trend,
      percentChange,
    };
  }, [historicalReadings]);

  const latestReading = historicalReadings?.[historicalReadings.length - 1];
  const latestValue = latestReading?.reading ?? 0;
  const maxValue = measurementType?.capacity ?? 100;
  const levelPercentage = Math.min(
    100,
    Math.max(0, Math.round((latestValue / maxValue) * 100))
  );

  const color = getColorForLevel(levelPercentage);

  const getTrendIcon = (trend: string, size = 18) => {
    if (trend === "up")
      return <TrendingUp size={size} className="text-green-500" />;
    if (trend === "down")
      return <TrendingDown size={size} className="text-red-500" />;
    return <Minus size={size} className="text-gray-400" />;
  };

  const formatReading = (value: number): string => {
    const safeValue = value ?? 0;
    return safeValue.toFixed(measurementType?.unit === "%" ? 1 : 3);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1200px] w-[95vw] max-h-[95vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            {measurementType?.name ?? "Unknown"} Trend
          </DialogTitle>
          <DialogDescription>
            Historical measurement data for {measurementType?.name ?? "Unknown"}{" "}
            ({measurementType?.unit ?? "units"})
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="timeRange"
                className="whitespace-nowrap font-medium"
              >
                Time Range:
              </Label>
              <Select
                value={selectedTimeRange.toString()}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger id="timeRange" className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px] grid grid-cols-2 p-1 gap-1 bg-muted rounded-md">
              <button
                onClick={() => setViewMode("chart")}
                className={`flex items-center justify-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "chart"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LineChart size={14} />
                <span>Chart</span>
              </button>
              <button
                onClick={() => setViewMode("stats")}
                className={`flex items-center justify-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-all ${
                  viewMode === "stats"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 size={14} />
                <span>Stats</span>
              </button>
            </div>
          </div>

          {isHistoricalLoading ? (
            <div className="space-y-4">
              <div className="h-[350px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
            </div>
          ) : viewMode === "chart" ? (
            <div className="w-full overflow-hidden">
              <MeasurementChart
                data={historicalReadings}
                measurementType={measurementType}
                timeRange={selectedTimeRange}
                color={color}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Current
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-2xl font-bold">
                          {formatReading(stats.current)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Average
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-2xl font-bold">
                          {formatReading(stats.avg)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Min / Max
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-lg font-semibold">
                          {formatReading(stats.min)}
                        </span>
                        <ArrowRight size={12} className="text-gray-400" />
                        <span className="text-lg font-semibold">
                          {formatReading(stats.max)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Trend
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {getTrendIcon(stats.trend)}
                        <span
                          className={`font-medium ${
                            stats.trend === "up"
                              ? "text-green-600"
                              : stats.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {stats.percentChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Median
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-semibold">
                          {formatReading(stats.median)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        The middle value when all readings are sorted
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Standard Deviation
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-semibold">
                          ±{formatReading(stats.stdDev)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Measures the amount of variation in the readings
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        Range
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-semibold">
                          {formatReading(stats.max - stats.min)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {measurementType?.unit ?? "units"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Difference between highest and lowest readings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Based on {historicalReadings?.length ?? 0} measurements from{" "}
                {historicalReadings &&
                historicalReadings.length > 0 &&
                historicalReadings[0]?.takenAt
                  ? new Date(historicalReadings[0].takenAt).toLocaleString()
                  : "-"}{" "}
                to{" "}
                {historicalReadings &&
                historicalReadings.length > 0 &&
                historicalReadings[historicalReadings.length - 1]?.takenAt
                  ? new Date(
                      historicalReadings[historicalReadings.length - 1]
                        .takenAt ?? ""
                    ).toLocaleString()
                  : "-"}
              </div>
            </div>
          )}

          {!isHistoricalLoading &&
            viewMode === "chart" &&
            historicalReadings &&
            historicalReadings.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-sm text-gray-500">Average</span>
                    <div className="font-semibold">
                      {formatReading(stats.avg)}{" "}
                      {measurementType?.unit ?? "units"}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Min/Max</span>
                    <div className="font-semibold">
                      {formatReading(stats.min)} - {formatReading(stats.max)}{" "}
                      {measurementType?.unit ?? "units"}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Median</span>
                    <div className="font-semibold">
                      {formatReading(stats.median)}{" "}
                      {measurementType?.unit ?? "units"}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Trend</span>
                    <div className="font-semibold flex items-center justify-center gap-1">
                      {getTrendIcon(stats.trend, 16)}
                      <span
                        className={
                          stats.trend === "up"
                            ? "text-green-600"
                            : stats.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {stats.percentChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
