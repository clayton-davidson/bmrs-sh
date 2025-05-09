import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

interface DataTableHeaderProps {
  title: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void | undefined;
  onCreateItem: (() => void) | undefined;
}

export function DataTableHeader({
  title,
  globalFilter,
  setGlobalFilter,
  onCreateItem,
}: DataTableHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full py-1 px-1 gap-2">
      <SearchInput value={globalFilter} onChange={setGlobalFilter} />
      <Button size="sm" onClick={onCreateItem}>
        Create {title}
      </Button>
    </div>
  );
}
