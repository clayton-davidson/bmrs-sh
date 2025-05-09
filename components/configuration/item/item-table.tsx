"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Item, ItemFormValues } from "@/types/configuration/item";
import { getItems, mergeItem } from "@/lib/data/configuration/item";
import { useAuthContext } from "@/components/providers/auth-provider";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { MergeItemDialog } from "./dialog";
import { useEntityState } from "@/lib/hooks/useEntityState";

export function ItemTable() {
  const { userId } = useAuthContext();

  const { data = [] } = useSuspenseQuery<Item[]>({
    queryKey: ["configuration/item"],
    queryFn: getItems,
  });

  const {
    editingEntity,
    isDialogOpen,
    globalFilter,
    setGlobalFilter,
    handleEdit,
    handleSave,
    handleCreateEntity,
    setIsDialogOpen,
  } = useEntityState<Item, ItemFormValues>({
    queryKey: ["configuration/item"],
    createDefaultEntity: () => ({
      id: 0,
      name: "",
    }),
  });

  const columns = getColumns(handleEdit);

  const saveItem = async (item: ItemFormValues) => {
    return mergeItem(item, userId);
  };

  return (
    <DataTable
      title="Item"
      columns={columns}
      data={data}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onCreateItem={handleCreateEntity}
      renderDialog={
        <MergeItemDialog
          item={editingEntity}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={(values) => handleSave(values, saveItem)}
        />
      }
    />
  );
}
