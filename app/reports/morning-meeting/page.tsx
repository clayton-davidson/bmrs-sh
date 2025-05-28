import { MorningMeetingContent } from "@/features/morning-meeting/components/MorningMeetingContent";
import { shiftSearchParamsCache } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morning Meeting",
};

export default async function MorningMeetingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { startDate, stopDate } = shiftSearchParamsCache.parse(params);

  return (
    <MorningMeetingContent
      initialStartDate={startDate}
      initialStopDate={stopDate}
    />
  );
}
