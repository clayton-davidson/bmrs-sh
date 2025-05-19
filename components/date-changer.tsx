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
import { ChevronLeft, Home, ChevronRight } from "lucide-react";
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

  const formatDate = (date: Date): string => {
    return dayjs(date).format("M/D/YYYY h:mm:ss A");
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-bold">{`${formatDate(
          displayDates.start
        )} - ${formatDate(displayDates.stop)}`}</p>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={getPreviousFunction()}
            disabled={isPending}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={getThisFunction()}
            disabled={isPending}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={getNextFunction()}
            disabled={isPending}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {showDateChangeRangeDropList && (
          <div className="w-full">
            <Select
              value={tmpMode}
              onValueChange={(value) => setTmpMode(value as DateChangerMode)}
            >
              <SelectTrigger className="w-full">
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
          </div>
        )}
        {showCustomDatesButton && (
          <Button
            size="sm"
            onClick={() => setWindowVisible(true)}
            disabled={isPending}
          >
            Custom Dates
          </Button>
        )}
        <Dialog
          open={windowVisible}
          onOpenChange={(open) => {
            console.log("Dialog state changing to:", open);
            setWindowVisible(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Custom Dates Selection</DialogTitle>
            </DialogHeader>
            <div onKeyDown={handleKeyDown}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">From:</p>
                  <DateTimePicker
                    value={tmpStartDate}
                    onChange={(date) => date && setTmpStartDate(date)}
                  />
                </div>
                <div>
                  <p className="mb-2">To:</p>
                  <DateTimePicker
                    value={tmpStopDate}
                    onChange={(date) => date && setTmpStopDate(date)}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={dateChange}>
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DateChanger;
