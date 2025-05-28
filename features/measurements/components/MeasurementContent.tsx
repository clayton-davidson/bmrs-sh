"use client";

import { useState } from "react";
import { Measurement, MeasurementType } from "../schemas/measurements";
import { useSuspenseQuery } from "@tanstack/react-query";
import MeasurementCards from "./MeasurementCards";
import MeasurementDetailsDialog from "./MeasurementDetailsDialog";

export default function MeasurementsContent() {
  const [selectedMeasurementType, setSelectedMeasurementType] =
    useState<MeasurementType | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { data: types = [] } = useSuspenseQuery<MeasurementType[], Error>({
    queryKey: ["measurementTypes"],
    queryFn: async (): Promise<MeasurementType[]> => {
      const response = await fetch("/api/measurements/types");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const { data: latestReadings = [] } = useSuspenseQuery<Measurement[], Error>({
    queryKey: ["latestMeasurements"],
    queryFn: async (): Promise<Measurement[]> => {
      const response = await fetch("/api/measurements/latest");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const handleCardClick = (measurementType: MeasurementType): void => {
    setSelectedMeasurementType(measurementType);
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
    setTimeout(() => setSelectedMeasurementType(null), 300);
  };

  return (
    <>
      <MeasurementCards
        types={types}
        latestReadings={latestReadings}
        onCardClick={handleCardClick}
      />

      {selectedMeasurementType && (
        <MeasurementDetailsDialog
          open={dialogOpen}
          onOpenChange={(open: boolean): void => {
            if (!open) handleCloseDialog();
            else setDialogOpen(true);
          }}
          measurementType={selectedMeasurementType}
        />
      )}
    </>
  );
}
