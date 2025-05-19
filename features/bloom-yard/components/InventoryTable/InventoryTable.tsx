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
import { BloomYardInventory } from "../../schemas/bloom-yard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { formatDate } from "@/lib/utils";

export function InventoryTable() {
  const { data, isLoading } = useSuspenseQuery<BloomYardInventory[], Error>({
    queryKey: ["bloom-yard/inventory"],
    queryFn: async () => {
      const response = await fetch("/api/bloom-yard/inventory");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const columnHelper = createColumnHelper<BloomYardInventory>();

  const columns: AccessorKeyColumnDefBase<BloomYardInventory, any>[] = useMemo(
    () => [
      columnHelper.accessor("STRAND", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Strand"} />
        ),
      }),
      columnHelper.accessor("SEQ", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Seq"} />
        ),
      }),
      columnHelper.accessor("BLOOM_ID", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Bloom ID"} />
        ),
      }),
      columnHelper.accessor("LOCATION", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Location"} />
        ),
      }),
      columnHelper.accessor("MOLD_SIZE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Mold Size"} />
        ),
      }),
      columnHelper.accessor("LENGTH", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Length"} />
        ),
      }),
      columnHelper.accessor("GRADE_CODE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Grade"} />
        ),
      }),
      columnHelper.accessor("CHARGE_MODE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Charge Mode"} />
        ),
      }),
      columnHelper.accessor("ORDER_ID", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Order"} />
        ),
      }),
      columnHelper.accessor("ORDER_DESCR", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Description"} />
        ),
      }),
      columnHelper.accessor("CREATE_DTM", {
        cell: (props) => {
          return <span>{formatDate(props.getValue())}</span>;
        },
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Create Date"} />
        ),
      }),
      columnHelper.accessor("WEIGHT", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Weight"} />
        ),
        footer: () => (
          <span>
            Total Tons:{" "}
            {data.reduce((acc, item) => acc + item.WEIGHT, 0).toFixed(2)}
          </span>
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
      enableGlobalFilter={true}
      enableExport={true}
      exportFileName="bloom-yard-inventory"
    />
  );
}
