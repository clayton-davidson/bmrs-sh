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

import { DataTable } from "@/components/ui/data-table";
import { DischargedCoolingBed } from "../../schemas/cooling-bed";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { formatDate } from "@/lib/utils";

export function DischargedTable() {
  const { data, isLoading } = useSuspenseQuery<DischargedCoolingBed[], Error>({
    queryKey: ["cooling-bed/discharged"],
    queryFn: async () => {
      const response = await fetch("/api/cooling-bed/discharged");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const columnHelper = createColumnHelper<DischargedCoolingBed>();

  const columns: AccessorKeyColumnDefBase<DischargedCoolingBed, any>[] =
    useMemo(
      () => [
        columnHelper.accessor("MULT_ID", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Mult Id"} />
          ),
        }),
        columnHelper.accessor("SP_ID", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Sp Id"} />
          ),
        }),
        columnHelper.accessor("PROD_SIZE", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Product"} />
          ),
        }),
        columnHelper.accessor("SEQ", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Sequence"} />
          ),
        }),
        columnHelper.accessor("HEAT_ID", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Heat Id"} />
          ),
        }),
        columnHelper.accessor("MULT_LEN", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Length"} />
          ),
        }),
        columnHelper.accessor("TEMP1", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Temp 1"} />
          ),
        }),
        columnHelper.accessor("TEMP2", {
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Temp 2"} />
          ),
        }),
        columnHelper.accessor("ROLL_DATE", {
          cell: (props) => {
            return <span>{formatDate(props.getValue())}</span>;
          },
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Roll Date"} />
          ),
        }),
        columnHelper.accessor("STR_DATE", {
          cell: (props) => {
            return <span>{formatDate(props.getValue())}</span>;
          },
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Str Date"} />
          ),
        }),
        columnHelper.accessor("LOSS_DATE", {
          cell: (props) => {
            return <span>{formatDate(props.getValue())}</span>;
          },
          header: (props) => (
            <DataTableColumnHeader column={props.column} header={"Loss Date"} />
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
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      enableExport={true}
      enableGlobalFilter={true}
      exportFileName="discharged-cooling-bed"
    />
  );
}
