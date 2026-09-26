import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { ParticipantList } from "@/components/members/profile/submissions/participant-list";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Page, RankedPersonalBest } from "@/lib/api/types";
import { useMediaStore } from "@/lib/media/media.store";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { metricName } from "@/lib/metrics";
import { useTableSearch } from "@/lib/table/use-table-search";
import { RelativeDate } from "@/lib/ui/relative-date";
import { formatTickTime } from "@/utils/dates";
import { bossIconUrl } from "@/utils/icons";

const columnHelper = createColumnHelper<DataTableFeatures, RankedPersonalBest>();

const buildColumns = (memberId: string) =>
  columnHelper.columns([
    columnHelper.accessor("content.name", {
      id: "content",
      header: "Content",
      enableHiding: false,
      meta: { minWidth: 16 },
      cell: ({ getValue, row }) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <MetricIcon src={bossIconUrl(getValue())} />
          {metricName(getValue())}
          <span className="font-normal text-base-content/60">{row.original.scale} man</span>
        </span>
      )
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
    columnHelper.accessor("team", {
      id: "team",
      header: "Team",
      enableSorting: false,
      meta: { minWidth: 16 },
      cell: ({ getValue }) => (
        <ParticipantList
          memberId={memberId}
          participants={getValue()}
        />
      )
    }),
    columnHelper.accessor("submittedAt", {
      id: "submittedAt",
      header: "Submitted",
      meta: {
        align: "right",
        minWidth: 8
      },
      cell: ({ getValue }) => <RelativeDate value={getValue()} />
    })
  ]);

type PersonalBestTableProps = {
  data: { items: RankedPersonalBest[]; page: Page } | undefined;
  error: Error | null;
  isLoading: boolean;
  memberId: string;
  onRetry: () => void;
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

export function PersonalBestTable({
  data,
  error,
  isLoading,
  memberId,
  onRetry,
  search,
  toolbar
}: Readonly<PersonalBestTableProps>) {
  const { showMedia } = useMediaStore();
  const table = useTableSearch(search);
  const columns = buildColumns(memberId);

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
