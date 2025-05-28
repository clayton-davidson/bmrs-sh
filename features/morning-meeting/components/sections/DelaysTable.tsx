"use client";

import { MorningMeetingDelay } from "../../schemas/morning-meeting";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import {
  AccessorKeyColumnDefBase,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export function DelaysTable({
  startDate,
  stopDate,
}: {
  startDate: Date;
  stopDate: Date;
}) {
  const { data = [], isLoading } = useQuery<MorningMeetingDelay[], Error>({
    queryKey: ["morning-meeting/delays", startDate, stopDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/morning-meeting/delays?startDate=${startDate}&stopDate=${stopDate}`
      );
      return response.json();
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });

  const significantDelays = useMemo(() => {
    return data.filter((delay) => {
      return delay.DURATION_MINUTES > 3;
    });
  }, [data]);

  const columnHelper = createColumnHelper<MorningMeetingDelay>();

  const columns: AccessorKeyColumnDefBase<MorningMeetingDelay, any>[] = useMemo(
    () => [
      columnHelper.accessor("PROD_SIZE", {
        header: "Product",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("CREW", {
        header: "Crew",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("START_TIME_FORMATTED", {
        header: "Started",
        id: "started",
        cell: (props) => {
          return <span>{props.getValue()}</span>;
        },
      }),
      columnHelper.accessor("DURATION", {
        header: "Duration",
        id: "duration",
        cell: (props) => <span>{props.getValue()}</span>,
        sortingFn: (rowA, rowB) => {
          return (
            rowA.original.DURATION_MINUTES - rowB.original.DURATION_MINUTES
          );
        },
      }),
      columnHelper.accessor("AREA", {
        header: "Area",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("REASON", {
        header: "Reason",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("NOTES", {
        header: "Notes",
        cell: (props) => (
          <div className="max-w-xs text-wrap">{props.getValue()}</div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: significantDelays,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Delays</h2>
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        enableExport={false}
        enableGlobalFilter={false}
        enablePagination={false}
        skeletonRows={5}
      />
    </div>
  );
}
