"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import MeasurementTank from "./MeasurementTank";
import { Measurement, MeasurementType } from "../schemas/measurements";

interface MeasurementCardsProps {
  types: MeasurementType[];
  latestReadings: Measurement[];
  onCardClick: (measurementType: MeasurementType) => void;
}

export default function MeasurementCards({
  types,
  latestReadings,
  onCardClick,
}: MeasurementCardsProps) {
  const calculatePercentage = (
    reading: number,
    type: MeasurementType
  ): number => {
    const minValue = 0;
    const maxValue = type.capacity;

    if (Math.abs(maxValue - minValue) < 0.001) {
      return 0;
    }

    const percentage = ((reading - minValue) / (maxValue - minValue)) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {types.map((type) => {
        const latestReading = latestReadings.find(
          (r) => r.typeId === Number(type.id)
        );
        const levelPercentage = latestReading
          ? calculatePercentage(latestReading.reading, type)
          : 0;

        return (
          <Card
            key={type.id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => onCardClick(type)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {type.name}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-[120px] w-full flex justify-center items-center">
                  <MeasurementTank
                    key={type.id}
                    typeId={Number(type.id)}
                    levelPercentage={levelPercentage}
                  />
                </div>

                <div className="w-full mt-2 flex justify-between items-center">
                  <div className="rounded text-left">
                    {latestReading ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-lg">
                          {latestReading.reading.toFixed(3)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {type.unit}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-sm">
                        No data available
                      </span>
                    )}
                  </div>

                  {latestReading && (
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        Updated{" "}
                        {new Date(latestReading.takenAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <div className="text-xs text-gray-400">
                        {new Date(latestReading.takenAt).toLocaleDateString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
