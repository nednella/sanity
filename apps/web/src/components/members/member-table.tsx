import { Link, useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { MemberStatusFilter } from "@/components/members/member-status-filter";
import { NationalityFlag } from "@/components/members/nationality-flag";
import { RankBadge } from "@/components/members/rank-badge";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Member, Page } from "@/lib/api/types";
import type { MembersSearch } from "@/lib/members/search";
import { useTableSearch } from "@/lib/table/use-table-search";
import { DASH, formatDate, formatNumber } from "@/utils/format";

const columnHelper = createColumnHelper<DataTableFeatures, Member>();

const columns = columnHelper.columns([
  columnHelper.accessor("displayName", {
    id: "displayName",
    header: "Name",
    enableHiding: false,
    enableSorting: false,
    meta: {
      minWidth: 12,
      pinned: true
    },
    cell: ({ row }) => {
      const { displayName, id, nationality, rsn } = row.original;
      const rsnLine = [rsn.main, rsn.alt].filter(Boolean).join(" / ");

      return (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="inline-flex items-center gap-2 font-medium">
            <Link
              to="/members/$memberId"
              params={{ memberId: id }}
              className="link link-hover"
            >
              {displayName}
            </Link>
            {nationality && <NationalityFlag countryCode={nationality} />}
          </span>
          {rsnLine && <span className="text-xs text-base-content/60">{rsnLine}</span>}
        </div>
      );
    }
  }),
  columnHelper.accessor("membership.rank", {
    id: "rank",
    header: "Rank",
    meta: { minWidth: 8 },
    enableSorting: false,
    cell: ({ getValue }) => {
      const rank = getValue();
      return <RankBadge rank={rank} />;
    }
  }),
  columnHelper.accessor("membership.points", {
    id: "clanPoints",
    header: "Clan Points",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("diary.points", {
    id: "diaryPoints",
    header: "Diary Points",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("diary.masterDiaries", {
    id: "masterDiaries",
    header: "Master Diaries",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("diary.claimedTier", {
    id: "claimedTier",
    header: "Highest Diary Tier",
    enableSorting: false,
    meta: {
      align: "right",
      minWidth: 8
    },
    cell: ({ getValue }) => getValue()?.name ?? DASH
  }),
  columnHelper.accessor("wom.totalLevel", {
    id: "totalLevel",
    header: "Total Level",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("wom.totalExp", {
    id: "totalExp",
    header: "Total XP",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue())
  }),
  columnHelper.accessor("wom.totalEhp", {
    id: "totalEhp",
    header: "EHP",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue(), 1)
  }),
  columnHelper.accessor("wom.totalEhb", {
    id: "totalEhb",
    header: "EHB",
    meta: {
      minWidth: 7,
      numeric: true
    },
    cell: ({ getValue }) => formatNumber(getValue(), 1)
  }),
  columnHelper.accessor("membership.joinedAt", {
    id: "joinedAt",
    header: "Joined",
    meta: {
      align: "right",
      minWidth: 8
    },
    cell: ({ getValue }) => formatDate(getValue())
  })
]);

const defaultColumnVisibility = {
  claimedTier: false,
  masterDiaries: false
};

type MemberTableProps = {
  data: { items: Member[]; page: Page } | undefined;
  error: Error | null;
  isLoading: boolean;
  onRetry: () => void;
  search: MembersSearch;
};

export function MemberTable({ data, error, isLoading, onRetry, search }: Readonly<MemberTableProps>) {
  const navigate = useNavigate();
  const { replaceSearch, ...table } = useTableSearch(search);

  return (
    <DataTable
      {...table}
      columns={columns}
      data={data?.items}
      emptyMessage="No members found."
      error={error}
      initialColumnVisibility={defaultColumnVisibility}
      isLoading={isLoading}
      onRetry={onRetry}
      onRowClick={(member) => navigate({ to: "/members/$memberId", params: { memberId: member.id } })}
      rowCount={data?.page.total ?? 0}
      search={{
        onChange: (value) => replaceSearch({ offset: 0, search: value }),
        placeholder: "Search by name or RSN",
        value: search.search
      }}
      toolbar={
        <MemberStatusFilter
          status={search.status}
          onChange={(status) => replaceSearch({ offset: 0, status })}
        />
      }
    />
  );
}
