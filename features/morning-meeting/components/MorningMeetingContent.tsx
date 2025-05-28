"use client";

import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo } from "react";
import DateChanger from "@/components/date-changer";
import { DelaysTable } from "./sections/DelaysTable";
import { QualityTable } from "./sections/QualityTable";
import { FailingHeatsTable } from "./sections/FailingHeatsTable";
import { RollShopNotes } from "./sections/RollShopNotes";
import { As400Handler } from "@/lib/misc/as400-handler";

export function MorningMeetingContent({
  initialStartDate,
  initialStopDate,
}: {
  initialStartDate: Date;
  initialStopDate: Date;
}) {
  const [searchParams, setSearchParams] = useQueryStates({
    startDate: parseAsIsoDateTime.withDefault(initialStartDate),
    stopDate: parseAsIsoDateTime.withDefault(initialStopDate),
  });

  const handleDateChanged = async (newStartDate: Date, newStopDate: Date) => {
    await setSearchParams({
      startDate: newStartDate,
      stopDate: newStopDate,
    });
  };

  const as400StartDate = useMemo(
    () => As400Handler.as400Date(searchParams.startDate),
    [searchParams.startDate]
  );
  const as400StartDateTime = useMemo(
    () => As400Handler.as400DateTime(searchParams.startDate),
    [searchParams.startDate]
  );
  const as400StopDateTime = useMemo(
    () => As400Handler.as400DateTime(searchParams.stopDate),
    [searchParams.stopDate]
  );

  return (
    <>
      <DateChanger
        startDate={searchParams.startDate}
        stopDate={searchParams.stopDate}
        onDateChanged={handleDateChanged}
        showCustomDatesButton={true}
      />

      <div className="space-y-4">
        <DelaysTable
          startDate={searchParams.startDate}
          stopDate={searchParams.stopDate}
        />
        <QualityTable
          startDate={searchParams.startDate}
          stopDate={searchParams.stopDate}
        />
        <FailingHeatsTable
          as400StartDate={as400StartDate}
          as400StartDateTime={as400StartDateTime}
          as400StopDateTime={as400StopDateTime}
        />
        <RollShopNotes
          startDate={searchParams.startDate}
          stopDate={searchParams.stopDate}
        />
      </div>
    </>
  );
}
