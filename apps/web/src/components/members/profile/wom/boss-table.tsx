import { createColumnHelper } from "@tanstack/react-table";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Snapshot } from "@/lib/api/types";
import { metricName } from "@/lib/metrics";
import { bossIconUrl, statIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

const EHB = "ehb";

type BossRow = {
  metric: string;
  kills: number | null;
  rank: number | null;
  ehb: number;
};

// Total EHB is a computed metric rather than a boss, so it rides along as a row of its own.
const toRows = (snapshot: Snapshot | undefined): BossRow[] | undefined => {
  if (!snapshot) return undefined;

  const totalEhb = snapshot.computed.find(({ metric }) => metric === EHB);

  return [
    ...(totalEhb ? [{ metric: EHB, kills: null, rank: totalEhb.rank, ehb: totalEhb.value }] : []),
    ...snapshot.bosses.map(({ boss, kills, rank, ehb }) => ({ metric: boss, kills, rank, ehb }))
  ];
};

const columnHelper = createColumnHelper<DataTableFeatures, BossRow>();

const columns = columnHelper.columns([
  columnHelper.accessor("metric", {
    id: "metric",
    header: "Boss",
    enableHiding: false,
    enableSorting: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) => {
      const metric = getValue();

      return (
        <span className="inline-flex items-center gap-2 font-medium">
          <MetricIcon src={metric === EHB ? statIconUrl(metric) : bossIconUrl(metric)} />
          {metricName(metric)}
        </span>
      );
    }
  }),
  columnHelper.accessor("kills", {
    id: "kills",
    header: "Kills",
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
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("ehb", {
    id: "ehb",
    header: "EHB",
    meta: {
      align: "right",
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue(), 1)
  })
]);

type BossTableProps = {
  emptyMessage: string;
  snapshot: Snapshot | undefined;
};

export function BossTable({ emptyMessage, snapshot }: Readonly<BossTableProps>) {
  return (
    <DataTable
      columns={columns}
      data={toRows(snapshot)}
      emptyMessage={emptyMessage}
      pinRow={(row) => row.metric === EHB}
      stickyHeader
    />
  );
}
