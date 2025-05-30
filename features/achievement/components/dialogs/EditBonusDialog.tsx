"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { ProductionBonusEditModel } from "@/lib/api/types.gen";

const formSchema = z.object({
  aCrew: z.coerce.number().min(0).max(300),
  bCrew: z.coerce.number().min(0).max(300),
  cCrew: z.coerce.number().min(0).max(300),
  dCrew: z.coerce.number().min(0).max(300),
  average: z.coerce.number().min(0).max(300),
});

interface EditBonusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Omit<ProductionBonusEditModel, "id" | "startDate" | "stopDate">;
  dateRange: {
    startDate: string;
    stopDate: string;
  };
  onSave: (data: ProductionBonusEditModel) => void;
  isLoading?: boolean;
}

export function EditBonusDialog({
  open,
  onOpenChange,
  initialData,
  dateRange,
  onSave,
  isLoading = false,
}: EditBonusDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aCrew: 0,
      bCrew: 0,
      cCrew: 0,
      dCrew: 0,
      average: 0,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    }
  }, [open, initialData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      ...data,
      startDate: dateRange.startDate,
      stopDate: dateRange.stopDate,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Production Bonus</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="aCrew"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">A Crew</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="300"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bCrew"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">B Crew</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="300"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cCrew"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">C Crew</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="300"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dCrew"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">D Crew</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="300"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="average"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Average</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="300"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
