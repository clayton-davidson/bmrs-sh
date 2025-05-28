"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { ChevronLeft, Home, ChevronRight, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { CrewCalculator } from "@/lib/misc/crew-calculator";

export enum DateChangerMode {
  YEAR = "YEAR",
  MONTH = "MONTH",
  WEEK = "WEEK",
  DAY = "DAY",
  SHIFT = "SHIFT",
}

const DateExtensions = {
  startOfWeek: (date: Date, startDay: number = 0): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day < startDay ? 7 : 0) + day - startDay;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  firstDayOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  lastDayOfMonth: (date: Date): Date => {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  },
};

interface DateChangerProps {
  startDate: Date;
  stopDate: Date;
  onDateChanged: (startDate: Date, stopDate: Date) => Promise<void>;
  showCustomDatesButton?: boolean;
  showDateChangeRangeDropList?: boolean;
  mode?: DateChangerMode;
}

const DateChanger = ({
  startDate,
  stopDate,
  onDateChanged,
  showCustomDatesButton = false,
  showDateChangeRangeDropList = false,
  mode = DateChangerMode.SHIFT,
}: DateChangerProps) => {
  const [windowVisible, setWindowVisible] = useState(false);
  const [tmpStartDate, setTmpStartDate] = useState<Date>(startDate);
  const [tmpStopDate, setTmpStopDate] = useState<Date>(stopDate);
  const [tmpMode, setTmpMode] = useState<DateChangerMode>(mode);
  const [displayDates, setDisplayDates] = useState({
    start: startDate,
    stop: stopDate,
  });

  useEffect(() => {
    setTmpStartDate(startDate);
    setTmpStopDate(stopDate);
    setTmpMode(mode);
    setDisplayDates({ start: startDate, stop: stopDate });
  }, [startDate, stopDate, mode]);

  const [isPending, startTransition] = useTransition();

  // Helper function to determine if dates represent "today" (for night shifts, check if it starts today)
  const isToday = (start: Date): boolean => {
    const today = new Date();
    const startDay = dayjs(start).format("YYYY-MM-DD");
    const todayDay = dayjs(today).format("YYYY-MM-DD");
    return startDay === todayDay;
  };

  // Helper function to get shift type based on start time
  const getShiftType = (start: Date): string => {
    const hour = start.getHours();
    return hour >= 6 && hour < 18 ? "Day Shift" : "Night Shift";
  };

  // Helper function to check if this represents a single shift (exactly 12 hours, 6 to 6)
  const isSingleShift = (start: Date, stop: Date): boolean => {
    // Calculate duration in hours
    const durationHours = (stop.getTime() - start.getTime()) / (1000 * 60 * 60);

    // Must be exactly 12 hours to be a single shift
    const isExactly12Hours = Math.abs(durationHours - 12) < 0.1;
    if (!isExactly12Hours) return false;

    const startDay = dayjs(start);
    const stopDay = dayjs(stop);
    const isSameDay =
      startDay.format("YYYY-MM-DD") === stopDay.format("YYYY-MM-DD");
    const startHour = start.getHours();
    const stopHour = stop.getHours();

    // Same calendar day (day shift: 6 AM to 6 PM)
    if (isSameDay) {
      return startHour === 6; // Must start at exactly 6 AM
    }

    // Night shift (spans exactly one day, 6 PM to 6 AM)
    const startDate = startDay.format("YYYY-MM-DD");
    const stopDate = stopDay.format("YYYY-MM-DD");
    const dayDifference = dayjs(stopDate).diff(dayjs(startDate), "day");

    return dayDifference === 1 && startHour === 18 && stopHour === 6;
  };

  // Smart date range formatter that handles all scenarios
  const formatSmartDateRange = (start: Date, stop: Date): string => {
    const startDay = dayjs(start);
    const stopDay = dayjs(stop);
    const isSameDay =
      startDay.format("YYYY-MM-DD") === stopDay.format("YYYY-MM-DD");
    const isSameYear = startDay.format("YYYY") === stopDay.format("YYYY");

    if (isSameDay) {
      return `${startDay.format("MMM D, YYYY")} • ${startDay.format(
        "h:mm A"
      )} - ${stopDay.format("h:mm A")}`;
    } else if (isSameYear) {
      return `${startDay.format("MMM D, h:mm A")} - ${stopDay.format(
        "MMM D, h:mm A, YYYY"
      )}`;
    } else {
      return `${startDay.format("MMM D, YYYY, h:mm A")} - ${stopDay.format(
        "MMM D, YYYY, h:mm A"
      )}`;
    }
  };

  // Improved date formatting based on mode and context
  const formatDateRange = (
    start: Date,
    stop: Date
  ): { primary: string; secondary: string } => {
    const startDay = dayjs(start);
    const stopDay = dayjs(stop);
    const isSingleShiftRange = isSingleShift(start, stop);

    // For multi-day ranges (not single shifts), show full datetime range in primary
    if (!isSingleShiftRange) {
      return {
        primary: formatSmartDateRange(start, stop),
        secondary: "",
      };
    }

    // For single shift ranges (including night shifts), show smart formatting based on mode
    if (tmpMode === DateChangerMode.SHIFT) {
      if (isToday(start)) {
        const shiftType = getShiftType(start);
        const secondary = `${startDay.format(
          "MMM D, YYYY"
        )} • ${startDay.format("h:mm A")} - ${stopDay.format("h:mm A")}`;

        return {
          primary: `Today • ${shiftType}`,
          secondary,
        };
      } else {
        return {
          primary: `${startDay.format("dddd")} • ${getShiftType(start)}`,
          secondary: `${startDay.format("MMM D, YYYY")} • ${startDay.format(
            "h:mm A"
          )} - ${stopDay.format("h:mm A")}`,
        };
      }
    } else if (tmpMode === DateChangerMode.DAY) {
      if (isToday(start)) {
        return {
          primary: "Today",
          secondary: `${startDay.format("MMM D, YYYY")} • ${startDay.format(
            "h:mm A"
          )} - ${stopDay.format("h:mm A")}`,
        };
      } else {
        return {
          primary: startDay.format("dddd"),
          secondary: `${startDay.format("MMM D, YYYY")} • ${startDay.format(
            "h:mm A"
          )} - ${stopDay.format("h:mm A")}`,
        };
      }
    } else {
      // For other modes on single shifts
      return {
        primary: startDay.format("MMM D, YYYY"),
        secondary: `${startDay.format("h:mm A")} - ${stopDay.format("h:mm A")}`,
      };
    }
  };

  const dateChange = async () => {
    setWindowVisible(false);
    setDisplayDates({ start: tmpStartDate, stop: tmpStopDate });
    await invokeDateChangedAndAssign(tmpStartDate, tmpStopDate);
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      await dateChange();
    }
  };

  const invokeDateChangedAndAssign = async (
    newStartDate: Date,
    newStopDate: Date
  ) => {
    startTransition(async () => {
      await onDateChanged(newStartDate, newStopDate);
    });
  };

  const changeDates = async (newStartDate: Date, newStopDate: Date) => {
    setTmpStartDate(newStartDate);
    setTmpStopDate(newStopDate);
    setDisplayDates({ start: newStartDate, stop: newStopDate });
    await invokeDateChangedAndAssign(newStartDate, newStopDate);
  };

  // Navigation functions
  const previousShift = () =>
    changeDates(
      new Date(tmpStartDate.getTime() - 12 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() - 12 * 60 * 60 * 1000)
    );

  const nextShift = () =>
    changeDates(
      new Date(tmpStartDate.getTime() + 12 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() + 12 * 60 * 60 * 1000)
    );

  const thisShift = () =>
    changeDates(
      CrewCalculator.startOfCurrentShift(),
      CrewCalculator.endOfCurrentShift()
    );

  const previousDay = () =>
    changeDates(
      new Date(tmpStartDate.getTime() - 24 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() - 24 * 60 * 60 * 1000)
    );

  const nextDay = () =>
    changeDates(
      new Date(tmpStartDate.getTime() + 24 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() + 24 * 60 * 60 * 1000)
    );

  const thisDay = () =>
    changeDates(
      CrewCalculator.startOfCurrentShift(),
      new Date(
        CrewCalculator.startOfCurrentShift().getTime() + 24 * 60 * 60 * 1000
      )
    );

  const previousWeek = () =>
    changeDates(
      new Date(tmpStartDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    );

  const nextWeek = () =>
    changeDates(
      new Date(tmpStartDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      new Date(tmpStopDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    );

  const thisWeek = () => {
    const startOfCurrentShift = CrewCalculator.startOfCurrentShift();
    const sunday = DateExtensions.startOfWeek(startOfCurrentShift, 0);
    return changeDates(
      new Date(
        sunday.getTime() + startOfCurrentShift.getHours() * 60 * 60 * 1000
      ),
      new Date(
        sunday.getTime() +
          7 * 24 * 60 * 60 * 1000 +
          startOfCurrentShift.getHours() * 60 * 60 * 1000
      )
    );
  };

  const previousMonth = () => {
    const prevMonthStart = new Date(tmpStartDate);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(tmpStopDate);
    prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);
    return changeDates(
      DateExtensions.firstDayOfMonth(prevMonthStart),
      DateExtensions.lastDayOfMonth(prevMonthEnd)
    );
  };

  const nextMonth = () => {
    const nextMonthStart = new Date(tmpStartDate);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
    const nextMonthEnd = new Date(tmpStopDate);
    nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1);
    return changeDates(
      DateExtensions.firstDayOfMonth(nextMonthStart),
      DateExtensions.lastDayOfMonth(nextMonthEnd)
    );
  };

  const thisMonth = () =>
    changeDates(
      DateExtensions.firstDayOfMonth(new Date()),
      DateExtensions.lastDayOfMonth(new Date())
    );

  const previousYear = () =>
    changeDates(
      new Date(
        tmpStartDate.getFullYear() - 1,
        tmpStartDate.getMonth(),
        tmpStartDate.getDate()
      ),
      new Date(
        tmpStopDate.getFullYear() - 1,
        tmpStopDate.getMonth(),
        tmpStopDate.getDate()
      )
    );

  const nextYear = () =>
    changeDates(
      new Date(
        tmpStartDate.getFullYear() + 1,
        tmpStartDate.getMonth(),
        tmpStartDate.getDate()
      ),
      new Date(
        tmpStopDate.getFullYear() + 1,
        tmpStopDate.getMonth(),
        tmpStopDate.getDate()
      )
    );

  const thisYear = () =>
    changeDates(
      CrewCalculator.beginningOfYear(new Date().getFullYear()),
      CrewCalculator.endOfYear(new Date().getFullYear())
    );

  const getPreviousFunction = () => {
    switch (tmpMode) {
      case DateChangerMode.YEAR:
        return previousYear;
      case DateChangerMode.MONTH:
        return previousMonth;
      case DateChangerMode.WEEK:
        return previousWeek;
      case DateChangerMode.DAY:
        return previousDay;
      case DateChangerMode.SHIFT:
        return previousShift;
      default:
        throw new Error("Invalid mode");
    }
  };

  const getNextFunction = () => {
    switch (tmpMode) {
      case DateChangerMode.YEAR:
        return nextYear;
      case DateChangerMode.MONTH:
        return nextMonth;
      case DateChangerMode.WEEK:
        return nextWeek;
      case DateChangerMode.DAY:
        return nextDay;
      case DateChangerMode.SHIFT:
        return nextShift;
      default:
        throw new Error("Invalid mode");
    }
  };

  const getThisFunction = () => {
    switch (tmpMode) {
      case DateChangerMode.YEAR:
        return thisYear;
      case DateChangerMode.MONTH:
        return thisMonth;
      case DateChangerMode.WEEK:
        return thisWeek;
      case DateChangerMode.DAY:
        return thisDay;
      case DateChangerMode.SHIFT:
        return thisShift;
      default:
        throw new Error("Invalid mode");
    }
  };

  const { primary, secondary } = formatDateRange(
    displayDates.start,
    displayDates.stop
  );

  return (
    <div>
      <div className="flex flex-col gap-4 py-2 md:flex-row md:items-center md:justify-between">
        {/* Date Display */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-lg font-semibold">{primary}</div>
          {secondary && (
            <div className="text-sm text-muted-foreground">{secondary}</div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 justify-center md:justify-end">
          {showDateChangeRangeDropList && (
            <Select
              value={tmpMode}
              onValueChange={(value) => setTmpMode(value as DateChangerMode)}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DateChangerMode).map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode.charAt(0) + mode.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={getPreviousFunction()}
              disabled={isPending}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={getThisFunction()}
              disabled={isPending}
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={getNextFunction()}
              disabled={isPending}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {showCustomDatesButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWindowVisible(true)}
              disabled={isPending}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Custom
            </Button>
          )}
        </div>

        <Dialog open={windowVisible} onOpenChange={setWindowVisible}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Custom Date Range</DialogTitle>
            </DialogHeader>
            <div onKeyDown={handleKeyDown}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 font-medium">From:</p>
                  <DateTimePicker
                    value={tmpStartDate}
                    onChange={(date) => date && setTmpStartDate(date)}
                  />
                </div>
                <div>
                  <p className="mb-2 font-medium">To:</p>
                  <DateTimePicker
                    value={tmpStopDate}
                    onChange={(date) => date && setTmpStopDate(date)}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setWindowVisible(false)}
                >
                  Cancel
                </Button>
                <Button onClick={dateChange}>Apply Range</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DateChanger;
