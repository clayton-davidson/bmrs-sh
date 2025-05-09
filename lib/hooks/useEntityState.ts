"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Base } from "@/types/core/base";

interface UseEntityStateOptions<TEntity extends Base> {
  queryKey: string[];
  createDefaultEntity: () => TEntity;
}

export function useEntityState<TEntity extends Base, TFormValues>({
  queryKey,
  createDefaultEntity,
}: UseEntityStateOptions<TEntity>) {
  const queryClient = useQueryClient();
  const [editingEntity, setEditingEntity] = useState<TEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleEdit = (entity: TEntity) => {
    setEditingEntity(entity);
    setIsDialogOpen(true);
  };

  const handleSave = async (
    entity: TFormValues,
    saveEntity: (entity: TFormValues) => Promise<TEntity>
  ) => {
    const saved = await saveEntity(entity);

    queryClient.setQueryData(queryKey, (oldData: TEntity[] = []) => {
      const existingIndex = oldData.findIndex((i) => i.id === saved.id);

      if (existingIndex >= 0) {
        const newItems = [...oldData];
        newItems[existingIndex] = saved;
        return newItems;
      }

      return [...oldData, saved];
    });

    setIsDialogOpen(false);
    return saved;
  };

  const handleCreateEntity = () => {
    setEditingEntity(createDefaultEntity());
    setIsDialogOpen(true);
  };

  return {
    editingEntity,
    isDialogOpen,
    globalFilter,
    setGlobalFilter,
    handleEdit,
    handleSave,
    handleCreateEntity,
    setIsDialogOpen,
  };
}
