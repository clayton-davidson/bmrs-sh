"use client";

import Image from "next/image";
import rt2BarT from "@/public/images/rt2Bar_t-removebg-preview.png";
import rt2T from "@/public/images/rt2_t-removebg-preview.png";

export default function RunoffTable({ isActive }: { isActive: boolean }) {
  const imageSrc = isActive ? rt2BarT : rt2T;
  const altText = isActive ? "Active Runoff Table" : "Inactive Runoff Table";

  return (
    <Image
      src={imageSrc}
      alt={altText}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      priority={true}
    />
  );
}
