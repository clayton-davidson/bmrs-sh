import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Row } from "@tanstack/react-table";

interface DataTableActionsProps<T> {
  row: Row<T>;
  onEdit: (item: T) => void;
}

export function DataTableActions<T>({ row, onEdit }: DataTableActionsProps<T>) {
  return (
    <Button variant="ghost" size={"sm"} onClick={() => onEdit(row.original)}>
      <Pencil aria-label="Edit row" />
    </Button>
  );
}
