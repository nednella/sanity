import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Page, RankedPersonalBest } from "@/lib/api/types";
import { useMediaStore } from "@/lib/media/media.store";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { metricName } from "@/lib/metrics";
import { useTableSearch } from "@/lib/table/use-table-search";
import { formatDate, formatTickTime } from "@/utils/dates";
import { bossIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

const columnHelper = createColumnHelper<DataTableFeatures, RankedPersonalBest>();

const columns = columnHelper.columns([
  columnHelper.accessor("content.name", {
    id: "content",
    header: "Content",
    enableHiding: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <MetricIcon src={bossIconUrl(getValue())} />
        {metricName(getValue())}
      </span>
    )
  }),
  columnHelper.accessor("scale", {
    id: "scale",
    header: "Team",
    meta: { minWidth: 5 },
    cell: ({ getValue }) => `${getValue()} man`
  }),
  columnHelper.accessor("timeSeconds", {
    id: "time",
    header: "Time",
    meta: {
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => formatTickTime(getValue())
  }),
  columnHelper.accessor("position", {
    id: "position",
    header: "Personal Rank",
    enableSorting: false,
    meta: {
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("team", {
    id: "team",
    header: "Team Members",
    enableSorting: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) =>
      getValue()
        .map((member) => member.displayName)
        .join(", ")
  }),
  columnHelper.accessor("submittedAt", {
    id: "submittedAt",
    header: "Submitted",
    meta: {
      align: "right",
      minWidth: 8
    },
    cell: ({ getValue }) => formatDate(getValue())
  })
]);

type PersonalBestTableProps = {
  data: { items: RankedPersonalBest[]; page: Page } | undefined;
  error: Error | null;
  isLoading: boolean;
  onRetry: () => void;
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

export function PersonalBestTable({
  data,
  error,
  isLoading,
  onRetry,
  search,
  toolbar
}: Readonly<PersonalBestTableProps>) {
  const { showMedia } = useMediaStore();
  const table = useTableSearch(search);

  const openScreenshot = ({ content, imageUrl, scale, timeSeconds }: RankedPersonalBest) => {
    if (!imageUrl) return;

    showMedia({ alt: `${metricName(content.name)}, ${scale} man, in ${formatTickTime(timeSeconds)}`, src: imageUrl });
  };

  return (
    <DataTable
      columns={columns}
      data={data?.items}
      emptyMessage="No personal bests recorded."
      error={error}
      isLoading={isLoading}
      onPaginationChange={table.onPaginationChange}
      onRetry={onRetry}
      onRowClick={openScreenshot}
      onSortingChange={table.onSortingChange}
      pagination={table.pagination}
      rowCount={data?.page.total ?? 0}
      filters={toolbar}
      sorting={table.sorting}
    />
  );
}
