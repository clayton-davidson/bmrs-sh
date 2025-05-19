import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 25, 50, 100],
  isLoading = false,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const groupSize = 10;

    const currentGroup = Math.floor(pageIndex / groupSize);
    const startPage = currentGroup * groupSize;
    const endPage = Math.min(startPage + groupSize - 1, pageCount - 1);

    if (currentGroup > 0) {
      pages.push("prev");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < pageCount - 1) {
      pages.push("next");
    }

    return pages;
  };

  const handleEllipsisClick = (direction: "prev" | "next") => {
    const groupSize = 10;
    const currentGroup = Math.floor(pageIndex / groupSize);

    if (direction === "prev") {
      const newPageIndex = (currentGroup - 1) * groupSize + (groupSize - 1);
      table.setPageIndex(Math.max(0, newPageIndex));
    } else {
      const newPageIndex = (currentGroup + 1) * groupSize;
      table.setPageIndex(Math.min(pageCount - 1, newPageIndex));
    }
  };

  const pageOptions = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-between px-2 py-3">
      {/* Mobile View */}
      <div className="flex items-center space-x-2 xl:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={isLoading || !table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={isLoading || !table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={isLoading || !table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={isLoading || !table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden xl:flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={isLoading || !table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={isLoading || !table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "prev" ? (
                <Button
                  variant="outline"
                  className="h-8 min-w-[32px] px-2"
                  onClick={() => handleEllipsisClick("prev")}
                  disabled={isLoading}
                >
                  ...
                </Button>
              ) : page === "next" ? (
                <Button
                  variant="outline"
                  className="h-8 min-w-[32px] px-2"
                  onClick={() => handleEllipsisClick("next")}
                  disabled={isLoading}
                >
                  ...
                </Button>
              ) : (
                <Button
                  variant={pageIndex === page ? "default" : "outline"}
                  className="h-8 min-w-[32px] px-2"
                  onClick={() => table.setPageIndex(page as number)}
                  disabled={isLoading}
                >
                  {(page as number) + 1}
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={isLoading || !table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={isLoading || !table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* info on the right */}
      <div className="text-sm text-muted-foreground">
        {totalRows === 0 ? "0 items" : `${start}-${end} of ${totalRows}`}
      </div>
    </div>
  );
}
