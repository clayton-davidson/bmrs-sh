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
import { Customer } from "../schemas/customers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { CustomerDialog } from "./CustomerDialog";

export function CustomerTable() {
  const { data, isLoading } = useSuspenseQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const columnHelper = createColumnHelper<Customer>();

  const columns: AccessorKeyColumnDefBase<Customer, any>[] = useMemo(
    () => [
      columnHelper.accessor("CUSTOMERNAME", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Customer"} />
        ),
      }),
      columnHelper.accessor("STATECODE", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"State"} />
        ),
      }),
      columnHelper.accessor("CITY", {
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"City"} />
        ),
      }),
      columnHelper.accessor("CREATEDATE", {
        cell: (props) => {
          return <span>{formatDate(props.getValue())}</span>;
        },
        header: (props) => (
          <DataTableColumnHeader column={props.column} header={"Created"} />
        ),
      }),
      columnHelper.accessor("CUSTOMER", {
        cell: (props) => <CustomerDialog customer={props.row.original} />,
        header: () => null,
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: data || [],
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
    <div className="m-2">
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        enableExport={true}
        enableGlobalFilter={true}
        exportFileName={"Customers"}
      />
    </div>
  );
}
