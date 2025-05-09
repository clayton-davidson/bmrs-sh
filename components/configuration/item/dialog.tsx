import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ItemSchema, Item, ItemFormValues } from "@/types/configuration/item";
import { useEffect } from "react";

interface MergeItemDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ItemFormValues) => Promise<Item>;
}

export function MergeItemDialog({
  item,
  open,
  onOpenChange,
  onSave,
}: MergeItemDialogProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form]);

  function onSubmit(values: ItemFormValues) {
    onSave(values);
    toast("Item updated successfully");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Create Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {item && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <div className="col-span-3 space-y-1">
                        <Input
                          id="name"
                          {...field}
                          className={fieldState.error ? "border-red-500" : ""}
                        />
                        {fieldState.error && (
                          <p className="text-sm text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save changes
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
