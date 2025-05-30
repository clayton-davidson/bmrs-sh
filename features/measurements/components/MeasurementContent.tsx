"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MeasurementCards from "./MeasurementCards";
import MeasurementDetailsDialog from "./MeasurementDetailsDialog";
import {
  getLatestMeasurementsOptions,
  getMeasurementTypesOptions,
} from "@/lib/api/@tanstack/react-query.gen";
import { MeasurementTypeModel } from "@/lib/api";

export default function MeasurementsContent() {
  const [selectedMeasurementType, setSelectedMeasurementType] =
    useState<MeasurementTypeModel | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { data: types } = useQuery({
    ...getMeasurementTypesOptions(),
    refetchInterval: 60000,
  });

  const { data: latestReadings = [] } = useQuery({
    ...getLatestMeasurementsOptions(),
    refetchInterval: 60000,
  });

  const handleCardClick = (measurementType: MeasurementTypeModel): void => {
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
