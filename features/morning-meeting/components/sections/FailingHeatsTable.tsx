"use client";

import { FailingHeat } from "../../schemas/morning-meeting";
import { DataTable } from "@/components/ui/data-table";
import { As400Handler } from "@/lib/misc/as400-handler";
import { useQuery } from "@tanstack/react-query";
import {
  AccessorKeyColumnDefBase,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export function FailingHeatsTable({
  as400StartDate,
  as400StartDateTime,
  as400StopDateTime,
}: {
  as400StartDate: number;
  as400StartDateTime: number;
  as400StopDateTime: number;
}) {
  const { data = [], isLoading } = useQuery<FailingHeat[], Error>({
    queryKey: [
      "morning-meeting/failing-heats",
      as400StartDate,
      as400StartDateTime,
      as400StopDateTime,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/morning-meeting/failing-heats?as400StartDate=${as400StartDate}&as400StartDateTime=${as400StartDateTime}&as400StopDateTime=${as400StopDateTime}`
      );
      return response.json();
    },
    refetchInterval: 30000,
    staleTime: 30000,
  });

  const columnHelper = createColumnHelper<FailingHeat>();

  const columns: AccessorKeyColumnDefBase<FailingHeat, any>[] = useMemo(
    () => [
      columnHelper.accessor("HEAT", {
        header: "Heat",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("PRODUCT", {
        header: "Product",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("GRADE", {
        header: "Grade",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("COMMENT", {
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

  if (isLoading || data.length === 0) {
    return null;
  }

  return (
    <div suppressHydrationWarning>
      <div className="mb-2"></div>
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Failing Heats</h2>
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
    </div>
  );
}
