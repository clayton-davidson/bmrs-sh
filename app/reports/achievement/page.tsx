"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getStarsByCrewOptions,
  getIncidentByCrewOptions,
  calculateYieldsOptions,
  getCobblesOptions,
  getBonusByCrewOptions,
  calculateTheoreticalBonusesOptions,
  mergeBonusByCrewMutation,
  mergeIncidentByCrewMutation,
} from "@/lib/api/@tanstack/react-query.gen";
import type {
  RunningBonusModel,
  IncidentEditModel,
  ProductionBonusEditModel,
} from "@/lib/api/types.gen";
import { IncidentsStarsChart } from "@/features/achievement/components/charts/IncidentsStarsChart";
import { YieldChart } from "@/features/achievement/components/charts/YieldChart";
import { CobblesChart } from "@/features/achievement/components/charts/CobblesChart";
import { ProductionBonusChart } from "@/features/achievement/components/charts/ProductionBonusChart";
import { EditBonusDialog } from "@/features/achievement/components/dialogs/EditBonusDialog";
import { EditIncidentDialog } from "@/features/achievement/components/dialogs/EditIncidentDialog";
import dayjs from "dayjs";
import { useAuth } from "@/components/providers/auth-provider";

const transformBonusForDialog = (
  bonusData: RunningBonusModel[] | undefined
) => {
  if (!bonusData || bonusData.length === 0) return undefined;

  return {
    aCrew: bonusData.find((item) => item.crew === "A")?.runningBonus ?? 0,
    bCrew: bonusData.find((item) => item.crew === "B")?.runningBonus ?? 0,
    cCrew: bonusData.find((item) => item.crew === "C")?.runningBonus ?? 0,
    dCrew: bonusData.find((item) => item.crew === "D")?.runningBonus ?? 0,
    average:
      bonusData.find((item) => item.crew === "Average")?.runningBonus ?? 0,
  };
};

export default function AchievementReportPage() {
  const [showEditBonusDialog, setShowEditBonusDialog] = useState(false);
  const [showEditIncidentDialog, setShowEditIncidentDialog] = useState(false);
  const { session, isAdmin } = useAuth();
  const canEdit = isAdmin;

  const queryClient = useQueryClient();

  const dateRanges = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentDayOfWeek = today.getDay();

    const daysUntilLastSunday = (currentDayOfWeek + 7) % 7;
    const lastSunday = dayjs(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )
      .add(-daysUntilLastSunday, "day")
      .add(6, "hours")
      .toDate();
    const previousSunday = dayjs(lastSunday).add(-7, "day").toDate();

    const ytdStartDate = new Date(currentYear, 0, 1);
    const ytdStopDate = dayjs(ytdStartDate)
      .add(1, "year")
      .subtract(1, "second")
      .toDate();

    return {
      today: today.toISOString(),
      ytdStartDate: ytdStartDate.toISOString(),
      ytdStopDate: ytdStopDate.toISOString(),
      weekStart: previousSunday.toISOString(),
      weekEnd: lastSunday.toISOString(),
    };
  }, []);

  const {
    data: ytdStars = [],
    isLoading: isStarsLoading,
    error: starsError,
  } = useQuery({
    ...getStarsByCrewOptions({
      query: {
        startDate: dateRanges.ytdStartDate,
        stopDate: dateRanges.today,
      },
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: incidentData,
    isLoading: isIncidentsLoading,
    error: incidentsError,
  } = useQuery({
    ...getIncidentByCrewOptions({
      query: {
        startDate: dateRanges.ytdStartDate,
        stopDate: dateRanges.ytdStopDate,
      },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: yieldData = [],
    isLoading: isYieldLoading,
    error: yieldError,
  } = useQuery({
    ...calculateYieldsOptions({
      query: {
        startDate: dateRanges.weekStart,
        stopDate: dateRanges.weekEnd,
        ytdStartDate: dateRanges.ytdStartDate,
      },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: cobblesData = [],
    isLoading: isCobblesLoading,
    error: cobblesError,
  } = useQuery({
    ...getCobblesOptions({
      query: {
        startDate: dateRanges.ytdStartDate,
        stopDate: dateRanges.today,
      },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: bonusData = [],
    isLoading: isBonusLoading,
    error: bonusError,
  } = useQuery({
    ...getBonusByCrewOptions({
      query: {
        startDate: dateRanges.weekStart,
        stopDate: dateRanges.weekEnd,
      },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: theoreticalBonusData = [],
    isLoading: isTheoreticalBonusLoading,
  } = useQuery({
    ...calculateTheoreticalBonusesOptions({
      body: {
        productionBonus:
          bonusData
            ?.filter((item) => item.crew && item.runningBonus != null) // Filter valid items
            ?.map((item) => ({
              crew: item.crew!,
              runningBonus: item.runningBonus!,
              totalHours: item.totalHours,
            })) || [],
        startDate: dateRanges.weekStart,
        stopDate: dateRanges.weekEnd,
      },
    }),
    enabled: !!bonusData && bonusData.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const mergeBonusMutation = useMutation({
    ...mergeBonusByCrewMutation({
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }),
    onSuccess: () => {
      const bonusQueryOptions = getBonusByCrewOptions({
        query: {
          startDate: dateRanges.weekStart,
          stopDate: dateRanges.weekEnd,
        },
      });
      queryClient.invalidateQueries(bonusQueryOptions);
      setShowEditBonusDialog(false);
    },
  });

  const mergeIncidentMutation = useMutation({
    ...mergeIncidentByCrewMutation({
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }),
    onSuccess: () => {
      const incidentQueryOptions = getIncidentByCrewOptions({
        query: {
          startDate: dateRanges.ytdStartDate,
          stopDate: dateRanges.ytdStopDate,
        },
      });

      queryClient.invalidateQueries(incidentQueryOptions);
      setShowEditIncidentDialog(false);
    },
  });

  const handleSaveBonus = (bonus: ProductionBonusEditModel) => {
    mergeBonusMutation.mutate({ body: bonus });
  };

  const handleSaveIncident = (incident: IncidentEditModel) => {
    mergeIncidentMutation.mutate({ body: incident });
  };

  return (
    <div className="space-y-4 h-full">
      {/* Section 1: YTD Incidents and STARS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>YTD Incidents and STARS</CardTitle>
          {canEdit && (
            <Button
              variant="ghost"
              onClick={() => setShowEditIncidentDialog(true)}
            >
              Edit Incidents
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isIncidentsLoading || isStarsLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : incidentsError || starsError ? (
            <Alert>
              <AlertDescription>
                Error loading incidents or stars data
              </AlertDescription>
            </Alert>
          ) : (
            <IncidentsStarsChart incidents={incidentData} stars={ytdStars} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Previous Week Yield and YTD Average Yield</CardTitle>
          </CardHeader>
          <CardContent>
            {isYieldLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : yieldError ? (
              <Alert>
                <AlertDescription>Error loading yield data</AlertDescription>
              </Alert>
            ) : (
              <YieldChart data={yieldData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>YTD Cobbles</CardTitle>
          </CardHeader>
          <CardContent>
            {isCobblesLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : cobblesError ? (
              <Alert>
                <AlertDescription>Error loading cobbles data</AlertDescription>
              </Alert>
            ) : (
              <CobblesChart data={cobblesData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Previous Week Production Bonus</CardTitle>
            {canEdit && (
              <Button
                onClick={() => setShowEditBonusDialog(true)}
                variant="ghost"
              >
                Edit Bonus
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isBonusLoading || isTheoreticalBonusLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : bonusError ? (
              <Alert>
                <AlertDescription>Error loading bonus data</AlertDescription>
              </Alert>
            ) : (
              <>
                <ProductionBonusChart
                  actualBonus={bonusData}
                  theoreticalBonus={theoreticalBonusData}
                />
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  Theoretical: Current Bonus × (Hours Without Unscheduled ÷
                  Current Hours)
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <EditBonusDialog
        open={showEditBonusDialog}
        onOpenChange={setShowEditBonusDialog}
        initialData={transformBonusForDialog(bonusData)}
        dateRange={{
          startDate: dateRanges.weekStart,
          stopDate: dateRanges.weekEnd,
        }}
        onSave={handleSaveBonus}
        isLoading={mergeBonusMutation.isPending}
      />

      <EditIncidentDialog
        open={showEditIncidentDialog}
        onOpenChange={setShowEditIncidentDialog}
        initialData={incidentData}
        dateRange={{
          startDate: dateRanges.ytdStartDate,
          stopDate: dateRanges.ytdStopDate,
        }}
        onSave={handleSaveIncident}
        isLoading={mergeIncidentMutation.isPending}
      />
    </div>
  );
}
