"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  AccessorKeyColumnDefBase,
} from "@tanstack/react-table";

import { HistoryCoolingBed } from "../../schemas/cooling-bed";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import DateChanger from "@/components/date-changer";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";

export function HistoryTable({
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

  const { data = [], isLoading } = useQuery<HistoryCoolingBed[], Error>({
    queryKey: [
      "cooling-bed/history",
      searchParams.startDate,
      searchParams.stopDate,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/cooling-bed/history?startDate=${searchParams.startDate}&stopDate=${searchParams.stopDate}`
      );
      return response.json();
    },
    refetchInterval: 30000,
  });

  const handleDateChanged = async (newStartDate: Date, newStopDate: Date) => {
    await setSearchParams({
      startDate: newStartDate,
      stopDate: newStopDate,
    });
  };

  const columnHelper = createColumnHelper<HistoryCoolingBed>();

  const columns: AccessorKeyColumnDefBase<HistoryCoolingBed, any>[] = useMemo(
    () => [
      columnHelper.accessor("MULTIPLE_ID", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Mult Id"} />
        ),
      }),
      columnHelper.accessor("SEMIPRODUCT_NO", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Sequence"} />
        ),
      }),
      columnHelper.accessor("JOB_ID", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Job Id"} />
        ),
      }),
      columnHelper.accessor("PROD_SIZE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Product"} />
        ),
      }),
      columnHelper.accessor("MULT_LEN", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Length"} />
        ),
      }),
      columnHelper.accessor("REHEATING_DATE", {
        cell: (props) => {
          return <span>{formatDate(props.getValue())}</span>;
        },
        header: (props) => (
          <DataTableColumnHeader
            column={props.column}
            header={"Reheating Date"}
          />
        ),
      }),
      columnHelper.accessor("ROLLING_DATE", {
        cell: (props) => {
          return <span>{formatDate(props.getValue())}</span>;
        },
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Str Date"} />
        ),
      }),
      columnHelper.accessor("SEMIPRODUCT_CODE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Bloom"} />
        ),
      }),
      columnHelper.accessor("STR_TEMP_1", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Str Temp"} />
        ),
      }),
      columnHelper.accessor("TGT_WEIGHT", {
        header: (props) => (
          <DataTableColumnHeader
            column={props.column}
            header={"Target Weight"}
          />
        ),
      }),
      columnHelper.accessor("SCALE_WGT", {
        header: (props) => (
          <DataTableColumnHeader
            column={props.column}
            header={"Scale Weight"}
          />
        ),
      }),
      columnHelper.accessor("DELTA", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Delta"} />
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
    },
  });

  return (
    <>
      <DateChanger
        startDate={searchParams.startDate}
        stopDate={searchParams.stopDate}
        onDateChanged={handleDateChanged}
        showCustomDatesButton={true}
      />
      <div className="mb-2"></div>
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        enableExport={true}
        enableGlobalFilter={true}
        exportFileName={"cooling-bed-history"}
      />
    </>
  );
}
