import { createColumnHelper } from "@tanstack/react-table";

import { MetricIcon } from "@/components/members/profile/overview/metric-icon";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Snapshot } from "@/lib/api/types";
import { metricName } from "@/lib/metrics";
import { skillIconUrl, statIconUrl } from "@/utils/icons";
import { formatNumber } from "@/utils/numbers";

const EHP = "ehp";

type SkillRow = {
  metric: string;
  level: number | null;
  experience: number | null;
  rank: number | null;
  ehp: number;
};

// Total EHP is a computed metric rather than a skill, so it rides along as a row of its own.
const toRows = (snapshot: Snapshot | undefined): SkillRow[] | undefined => {
  if (!snapshot) return undefined;

  const totalEhp = snapshot.computed.find(({ metric }) => metric === EHP);

  return [
    ...(totalEhp ? [{ metric: EHP, level: null, experience: null, rank: totalEhp.rank, ehp: totalEhp.value }] : []),
    ...snapshot.skills.map(({ skill, level, experience, rank, ehp }) => ({
      metric: skill,
      level,
      experience,
      rank,
      ehp
    }))
  ];
};

const columnHelper = createColumnHelper<DataTableFeatures, SkillRow>();

const columns = columnHelper.columns([
  columnHelper.accessor("metric", {
    id: "metric",
    header: "Skill",
    enableHiding: false,
    enableSorting: false,
    meta: { minWidth: 10 },
    cell: ({ getValue }) => {
      const metric = getValue();

      return (
        <span className="inline-flex items-center gap-2 font-medium">
          <MetricIcon src={metric === EHP ? statIconUrl(metric) : skillIconUrl(metric)} />
          {metricName(metric)}
        </span>
      );
    }
  }),
  columnHelper.accessor("level", {
    id: "level",
    header: "Level",
    meta: {
      minWidth: 5,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("experience", {
    id: "experience",
    header: "Experience",
    meta: {
      minWidth: 8,
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
  columnHelper.accessor("ehp", {
    id: "ehp",
    header: "EHP",
    meta: {
      align: "right",
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue(), 1)
  })
]);

type SkillTableProps = {
  emptyMessage: string;
  snapshot: Snapshot | undefined;
};

export function SkillTable({ emptyMessage, snapshot }: Readonly<SkillTableProps>) {
  return (
    <DataTable
      columns={columns}
      data={toRows(snapshot)}
      emptyMessage={emptyMessage}
      pinRow={(row) => row.metric === EHP}
      stickyHeader
    />
  );
}
