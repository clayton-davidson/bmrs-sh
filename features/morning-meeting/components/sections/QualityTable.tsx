"use client";

import { Quality } from "../../schemas/morning-meeting";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import {
  AccessorKeyColumnDefBase,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export function QualityTable({
  startDate,
  stopDate,
}: {
  startDate: Date;
  stopDate: Date;
}) {
  const { data = [], isLoading } = useQuery<Quality[], Error>({
    queryKey: ["morning-meeting/quality", startDate, stopDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/morning-meeting/quality?startDate=${startDate}&stopDate=${stopDate}`
      );
      return response.json();
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });

  const columnHelper = createColumnHelper<Quality>();

  const columns: AccessorKeyColumnDefBase<Quality, any>[] = useMemo(
    () => [
      columnHelper.accessor("PRODUCTID", {
        header: "Product",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("CREW", {
        header: "Crew",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("WEIGHT", {
        header: "Weight",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("PIECES", {
        header: "Pieces",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("LENGTH", {
        header: "Length",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("DEFECT", {
        header: "Defect",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("DISPOSITION", {
        header: "Disposition",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("ENTRYDATE_FORMATTED", {
        header: "Entry Date",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("HEAT", {
        header: "Heat Id",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("SCRAPCOMMENT", {
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
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Quality</h2>
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
