import { getItems } from "@/lib/data/configuration/item";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { Metadata } from "next";
import { ItemTable } from "@/components/configuration/item/item-table";

export const metadata: Metadata = {
  title: "Items",
};

export default async function ItemPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["configuration/item"],
    queryFn: getItems,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemTable />
    </HydrationBoundary>
  );
}
