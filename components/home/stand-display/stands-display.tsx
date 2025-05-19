"use client";

import { Card, CardContent } from "@/components/ui/card";
import Stand from "./stand";
import RunoffTable from "./runoff-table";
import { useSSEConnection } from "@/hooks/use-sse-connection";

export default function StandsDisplay() {
  const { state, loading } = useSSEConnection("/api/sse");

  const {
    isS1,
    isS2,
    isS3,
    isS4,
    isS5,
    isS6,
    isS7,
    isS7Hmd,
    isS8,
    isS9,
    isS9Hmd,
    isS10,
    isS11,
    isS11Hmd,
    isS12,
    isS13,
    isS13Hmd,
    isS14,
    isS15,
    isS15Hmd,
    isRt2,
    isRt2Hmd,
  } = state;

  return (
    <div className="relative">
      <Card className="mt-2">
        <CardContent>
          <div className="relative mx-0 mt-[-0.75rem] mb-[1.9rem] w-full">
            <div className="absolute left-[81%] top-0">
              <span className="rounded-[5px] bg-[#006325] text-white px-1 py-0.5 text-[9px] sm:px-0.5 sm:py-[1px] sm:text-[10px] md:px-[2px] md:py-[2px] md:text-[11px] lg:px-[3px] lg:py-[3px] lg:text-[13px]">
                Roughing Mill Stands
              </span>
            </div>

            <div className="absolute left-[25%] top-0">
              <span className="rounded-[5px] bg-[#006325] text-white px-1 py-0.5 text-[9px] sm:px-0.5 sm:py-[1px] sm:text-[10px] md:px-[2px] md:py-[2px] md:text-[11px] lg:px-[3px] lg:py-[3px] lg:text-[13px]">
                Finishing Mill Stands
              </span>
            </div>

            <div
              className="absolute left-[65.6%] top-0"
              style={{ transform: "translateX(-50%)" }}
            >
              <span className="rounded-[5px] bg-[#006325] text-white px-1 py-0.5 text-[9px] sm:px-0.5 sm:py-[1px] sm:text-[10px] md:px-[2px] md:py-[2px] md:text-[11px] lg:px-[3px] lg:py-[3px] lg:text-[13px]">
                Roll Table 2
              </span>
            </div>
          </div>

          <div className="grid grid-cols-16 gap-0">
            <div className="col-span-1">
              <Stand
                isActive={isS15 || isS15Hmd || (isS12 && isS15)}
                alt="Stand 15"
              />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS14 || isS13Hmd} alt="Stand 14" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS13 || isS13Hmd} alt="Stand 13" />
            </div>
            <div className="col-span-1">
              <Stand
                isActive={isS12 || isS11Hmd || (isS12 && isS15)}
                alt="Stand 12"
              />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS11 || isS11Hmd} alt="Stand 11" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS10 || isS9Hmd} alt="Stand 10" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS9 || isS9Hmd} alt="Stand 9" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS8 || isS7Hmd} alt="Stand 8" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS7 || isS7Hmd} alt="Stand 7" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS6} alt="Stand 6" />
            </div>
            <div className="col-span-1">
              <RunoffTable isActive={isRt2 || isRt2Hmd} />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS5} alt="Stand 5" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS4} alt="Stand 4" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS3} alt="Stand 3" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS2} alt="Stand 2" />
            </div>
            <div className="col-span-1">
              <Stand isActive={isS1} alt="Stand 1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
