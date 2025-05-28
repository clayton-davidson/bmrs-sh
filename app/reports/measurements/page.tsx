import MeasurementsContent from "@/features/measurements/components/MeasurementContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Measurements",
};

export default async function MeasurementsPage() {
  return <MeasurementsContent />;
}
