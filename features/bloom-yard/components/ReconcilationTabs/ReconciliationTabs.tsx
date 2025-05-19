"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateChanger from "@/components/date-changer";
import {
  BloomYardBalance,
  BloomYard,
  BloomYardCurrent,
  BloomYardEnd,
} from "@/features/bloom-yard/schemas/bloom-yard";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { formatDate } from "@/lib/utils";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  AccessorKeyColumnDefBase,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

const TABS = [
  { id: "start", label: "Start" },
  { id: "produced", label: "Produced" },
  { id: "created", label: "Created" },
  { id: "consumed", label: "Consumed" },
  { id: "scrapped", label: "Scrapped" },
  { id: "end", label: "End" },
  { id: "balance", label: "Balance" },
  { id: "current", label: "Current" },
  { id: "runnable", label: "Runnable" },
];

type TabDataTypes = {
  start: BloomYardEnd;
  produced: BloomYard;
  created: BloomYard;
  consumed: BloomYard;
  scrapped: BloomYard;
  end: BloomYardEnd;
  balance: BloomYardBalance;
  current: BloomYardCurrent;
  runnable: BloomYardCurrent;
};

export default function ReconciliationTabs({
  initialStartDate,
  initialStopDate,
}: {
  initialStartDate: Date;
  initialStopDate: Date;
}) {
  const [searchParams, setSearchParams] = useQueryStates({
    startDate: parseAsIsoDateTime.withDefault(initialStartDate),
    stopDate: parseAsIsoDateTime.withDefault(initialStopDate),
  });

  const [activeTab, setActiveTab] = useState("balance");

  const useTabData = <T extends keyof TabDataTypes>(tabId: T) => {
    return useQuery<TabDataTypes[T][], Error>({
      queryKey: [
        `bloom-yard/reconciliation/${tabId}`,
        searchParams.startDate,
        searchParams.stopDate,
      ],
      queryFn: async () => {
        const response = await fetch(
          `/api/bloom-yard/reconciliation/${tabId}?startDate=${searchParams.startDate.toISOString()}&stopDate=${searchParams.stopDate.toISOString()}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch ${tabId} data`);
        }
        return response.json();
      },
      enabled: activeTab === tabId,
    });
  };

  const { data: startData = [], isLoading: startLoading } = useTabData("start");
  const { data: producedData = [], isLoading: producedLoading } =
    useTabData("produced");
  const { data: createdData = [], isLoading: createdLoading } =
    useTabData("created");
  const { data: consumedData = [], isLoading: consumedLoading } =
    useTabData("consumed");
  const { data: scrappedData = [], isLoading: scrappedLoading } =
    useTabData("scrapped");
  const { data: endData = [], isLoading: endLoading } = useTabData("end");
  const { data: balanceData = [], isLoading: balanceLoading } =
    useTabData("balance");
  const { data: currentData = [], isLoading: currentLoading } =
    useTabData("current");
  const { data: runnableData = [], isLoading: runnableLoading } =
    useTabData("runnable");

  const handleDateChanged = async (newStartDate: Date, newStopDate: Date) => {
    await setSearchParams({
      startDate: newStartDate,
      stopDate: newStopDate,
    });
  };

  const getActiveData = () => {
    switch (activeTab) {
      case "start":
        return { data: startData, isLoading: startLoading };
      case "produced":
        return { data: producedData, isLoading: producedLoading };
      case "created":
        return { data: createdData, isLoading: createdLoading };
      case "consumed":
        return { data: consumedData, isLoading: consumedLoading };
      case "scrapped":
        return { data: scrappedData, isLoading: scrappedLoading };
      case "end":
        return { data: endData, isLoading: endLoading };
      case "balance":
        return { data: balanceData, isLoading: balanceLoading };
      case "current":
        return { data: currentData, isLoading: currentLoading };
      case "runnable":
        return { data: runnableData, isLoading: runnableLoading };
      default:
        return { data: [], isLoading: false };
    }
  };

  const renderStartEndTable = (data: BloomYardEnd[], isLoading: boolean) => {
    const columnHelper = createColumnHelper<BloomYardEnd>();

    const columns: AccessorKeyColumnDefBase<BloomYardEnd, any>[] = [
      columnHelper.accessor("SEMIPROD", {
        header: "Size",
      }),
      columnHelper.accessor("COUNT", {
        header: "Count",
      }),
      columnHelper.accessor("WEIGHT", {
        header: "Weight",
      }),
      columnHelper.accessor("RECORDDATE", {
        header: "Record Date",
        cell: (props) => <span>{formatDate(props.getValue())}</span>,
      }),
    ];

    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={10}
        enablePagination={false}
      />
    );
  };

  const renderBloomYardTable = (data: BloomYard[], isLoading: boolean) => {
    const columnHelper = createColumnHelper<BloomYard>();

    const columns: AccessorKeyColumnDefBase<BloomYard, any>[] = [
      columnHelper.accessor("ITEM", {
        header: "Size",
      }),
      columnHelper.accessor("COUNT", {
        header: "Count",
      }),
      columnHelper.accessor("LENGTH", {
        header: "Length",
      }),
      columnHelper.accessor("WEIGHT", {
        header: "Weight",
      }),
    ];

    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={10}
        enablePagination={false}
      />
    );
  };

  const renderBalanceTable = (data: BloomYardBalance[], isLoading: boolean) => {
    const columnHelper = createColumnHelper<BloomYardBalance>();

    const columns: AccessorKeyColumnDefBase<BloomYardBalance, any>[] = [
      columnHelper.accessor("ITEM", {
        header: "Item",
      }),
      columnHelper.accessor("COUNT", {
        header: "Count",
      }),
      columnHelper.accessor("WEIGHT", {
        header: "Weight",
      }),
    ];

    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        exportFileName={`bloom-yard-balance`}
        skeletonRows={10}
        enableGlobalFilter={false}
        enablePagination={false}
      />
    );
  };

  const renderCurrentTable = (data: BloomYardCurrent[], isLoading: boolean) => {
    const columnHelper = createColumnHelper<BloomYardCurrent>();

    const columns: AccessorKeyColumnDefBase<BloomYardCurrent, any>[] = [
      columnHelper.accessor("SEMIPROD", {
        header: "Semiproduct",
      }),
      columnHelper.accessor("LOCATION", {
        header: "Location",
      }),
      columnHelper.accessor("GRADE", {
        header: "Grade",
      }),
      columnHelper.accessor("ORD_LENGTH", {
        header: "Order Length",
      }),
      columnHelper.accessor("COUNT", {
        header: "Count",
      }),
      columnHelper.accessor("LENGTH", {
        header: "Length",
      }),
      columnHelper.accessor("WEIGHT", {
        header: "Weight",
      }),
    ];

    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: {
        pagination: {
          pageSize: 25,
          pageIndex: 0,
        },
      },
    });

    return <DataTable table={table} columns={columns} isLoading={isLoading} />;
  };

  const renderActiveTabContent = () => {
    const { data, isLoading } = getActiveData();

    switch (activeTab) {
      case "start":
      case "end":
        return renderStartEndTable(data as BloomYardEnd[], isLoading);

      case "produced":
      case "created":
      case "consumed":
      case "scrapped":
        return renderBloomYardTable(data as BloomYard[], isLoading);

      case "balance":
        return renderBalanceTable(data as BloomYardBalance[], isLoading);

      case "current":
      case "runnable":
        return renderCurrentTable(data as BloomYardCurrent[], isLoading);

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            No content available
          </div>
        );
    }
  };

  return (
    <div className="container-fluid px-4">
      <DateChanger
        startDate={searchParams.startDate}
        stopDate={searchParams.stopDate}
        onDateChanged={handleDateChanged}
        showCustomDatesButton={true}
      />

      <div className="mb-2"></div>

      <div className="flex w-full">
        <div className="border-r pr-4 pt-2 min-w-[100px]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="w-full"
          >
            <TabsList
              className="flex flex-col h-auto items-stretch space-y-1 bg-background"
              aria-orientation="vertical"
            >
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="justify-start text-left px-3 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 pl-4">{renderActiveTabContent()}</div>
      </div>
    </div>
  );
}
