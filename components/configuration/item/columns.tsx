"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Item } from "@/types/configuration/item";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useAuthContext } from "@/components/providers/auth-provider";
import { DataTableActions } from "@/components/ui/data-table-actions";

export function getColumns(onEdit: (item: Item) => void): ColumnDef<Item>[] {
  const { isAdmin } = useAuthContext();

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      id: "actions",
      cell: ({ row }: { row: Row<Item> }) => {
        return <DataTableActions row={row} onEdit={onEdit} />;
      },
    });
  }

  return columns;
}
