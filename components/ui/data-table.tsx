import {
  AccessorKeyColumnDefBase,
  flexRender,
  Table as TanstackTable,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface DataTableProps<TData, TValue> {
  table: TanstackTable<TData>;
  columns: AccessorKeyColumnDefBase<TData, TValue>[];
  isLoading?: boolean;
  enableGlobalFilter?: boolean;
  enableExport?: boolean;
  skeletonRows?: number;
  exportFileName?: string;
  enablePagination?: boolean;
}

const TableSearch = ({
  value,
  onChange,
  isLoading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-8"
        aria-label="Search table data"
        disabled={isLoading}
      />
      {value && (
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-full px-2 py-0"
          onClick={() => onChange("")}
          aria-label="Clear search"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
};

const exportToCSV = <TData,>(
  data: TData[],
  columns: AccessorKeyColumnDefBase<TData, any>[],
  fileName: string
) => {
  const headers = columns.map((column) => column.accessorKey || "");

  const rows = data.map((row) => {
    return columns
      .map((column) => {
        const accessorKey = column.accessorKey as string;
        const value = accessorKey ? row[accessorKey as keyof TData] : "";

        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);

        if (typeof value === "string") {
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
        }

        return String(value);
      })
      .join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TableSkeleton = ({
  columns,
  rows = 25,
}: {
  columns: number;
  rows?: number;
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <div className="h-6 w-full max-w-24 bg-muted animate-pulse rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`${rowIndex}-${colIndex}`}>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const EmptyState = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="h-24 text-center text-muted-foreground"
    >
      No results found.
    </TableCell>
  </TableRow>
);

export function DataTable<TData, TValue>({
  table,
  columns,
  isLoading = false,
  enableGlobalFilter = false,
  enableExport = false,
  skeletonRows = 25,
  exportFileName = "table-data",
  enablePagination = true,
}: DataTableProps<TData, TValue>) {
  const globalFilter = table.getState().globalFilter as string;

  const handleFilterChange = useCallback(
    (value: string) => {
      table.setGlobalFilter(value);
    },
    [table]
  );

  const handleExport = useCallback(() => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCSV(data, columns, exportFileName);
  }, [table, columns, exportFileName]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {(enableGlobalFilter || enableExport) && (
          <div className="flex items-center justify-between gap-2">
            {enableGlobalFilter && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                <Input
                  placeholder="Search..."
                  value=""
                  onChange={() => {}}
                  className="pl-8 pr-8 opacity-70"
                  aria-label="Search table data"
                  disabled={true}
                />
              </div>
            )}
            {enableExport && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {}}
                className="flex items-center gap-2 opacity-70"
                disabled={true}
              >
                <span>Export</span>
              </Button>
            )}
          </div>
        )}

        <TableSkeleton columns={columns.length} rows={skeletonRows} />
      </div>
    );
  }

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();
  const footerGroups = table.getFooterGroups();
  const hasFooter = columns.some((column) => column.footer);

  const renderTableControls = enableGlobalFilter || enableExport;

  return (
    <div className="space-y-4">
      {renderTableControls && (
        <div className="flex items-center justify-between gap-2">
          {enableGlobalFilter && (
            <TableSearch
              value={globalFilter || ""}
              onChange={handleFilterChange}
              isLoading={false}
            />
          )}
          {enableExport && (
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
              disabled={table.getFilteredRowModel().rows.length === 0}
            >
              <span>Export</span>
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rowModel.rows?.length ? (
              rowModel.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState colSpan={columns.length} />
            )}
          </TableBody>
          {hasFooter && (
            <TableFooter>
              {footerGroups.map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </div>

      {enablePagination && <DataTablePagination table={table} />}
    </div>
  );
}

export default DataTable;
