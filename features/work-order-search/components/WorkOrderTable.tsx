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

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import DateChanger from "@/components/date-changer";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import { getMechanicalWorkOrdersOptions } from "@/lib/api/@tanstack/react-query.gen";
import { WorkOrderModel } from "@/lib/api";

export function WorkOrderTable({
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

  const { data = [], isLoading } = useQuery({
    ...getMechanicalWorkOrdersOptions({
      query: {
        startDate: searchParams.startDate.toISOString(),
        stopDate: searchParams.stopDate.toISOString(),
      },
    }),
    refetchInterval: 60000,
  });

  const handleDateChanged = async (newStartDate: Date, newStopDate: Date) => {
    await setSearchParams({
      startDate: newStartDate,
      stopDate: newStopDate,
    });
  };

  const columnHelper = createColumnHelper<WorkOrderModel>();

  const columns: AccessorKeyColumnDefBase<WorkOrderModel, any>[] = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Id"} />
        ),
      }),
      columnHelper.accessor("name", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Name"} />
        ),
      }),
      columnHelper.accessor("summarynote", {
        header: (props) => (
          <DataTableColumnHeader
            column={props.column}
            header={"Summary Note"}
          />
        ),
      }),
      columnHelper.accessor("memo", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Memo"} />
        ),
      }),
      columnHelper.accessor("eventdate", {
        cell: (props) => {
          return <span>{formatDate(props.getValue())}</span>;
        },
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Event Date"} />
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
        exportFileName={"work-order-table"}
      />
    </>
  );
}
