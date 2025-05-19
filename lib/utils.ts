import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { createSearchParamsCache, parseAsIsoDateTime } from "nuqs/server";
import { CrewCalculator } from "@/lib/misc/crew-calculator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createValidator = <T>(schema: z.ZodType<T>) => {
  return (rows: unknown[]): T[] => {
    return rows.map((row) => schema.parse(row));
  };
};

export const formatDate = (date: Date | string | null) => {
  if (date === null) {
    return null;
  }
  return dayjs(date).format("M/D/YYYY h:mm A");
};

export const shiftSearchParamsCache = createSearchParamsCache({
  startDate: parseAsIsoDateTime.withDefault(
    CrewCalculator.startOfCurrentShift()
  ),
  stopDate: parseAsIsoDateTime.withDefault(CrewCalculator.endOfCurrentShift()),
});
