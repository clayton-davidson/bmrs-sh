import { WorkOrderTable } from "@/features/work-order-search/components/WorkOrderTable";
import { shiftSearchParamsCache } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Order Search",
};

export default async function WorkOrderSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const { startDate, stopDate } = shiftSearchParamsCache.parse(params);

  return (
    <WorkOrderTable initialStartDate={startDate} initialStopDate={stopDate} />
  );
}
