import { createColumnHelper } from "@tanstack/react-table";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Activity } from "@/lib/api/types";
import { metricName } from "@/lib/metrics";
import { activityIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

const columnHelper = createColumnHelper<DataTableFeatures, Activity>();

const columns = columnHelper.columns([
  columnHelper.accessor("activity", {
    id: "activity",
    header: "Activity",
    enableHiding: false,
    enableSorting: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <MetricIcon src={activityIconUrl(getValue())} />
        {metricName(getValue())}
      </span>
    )
  }),
  columnHelper.accessor("score", {
    id: "score",
    header: "Score",
    meta: {
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("rank", {
    id: "rank",
    header: "Rank",
    meta: {
      align: "right",
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  })
]);

type ActivityTableProps = {
  activities: Activity[] | undefined;
  emptyMessage: string;
};

export function ActivityTable({ activities, emptyMessage }: Readonly<ActivityTableProps>) {
  return (
    <DataTable
      columns={columns}
      data={activities}
      emptyMessage={emptyMessage}
      stickyHeader
    />
  );
}
