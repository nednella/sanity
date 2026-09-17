import { Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { NationalityFlag } from "@/components/members/nationality-flag.js";
import type { DataTableFeatures } from "@/components/table/table-features.js";
import type { Member } from "@/lib/api/query/members.js";
import { DASH, formatDate, formatNumber } from "@/utils/format.js";

const columnHelper = createColumnHelper<DataTableFeatures, Member>();

export const memberColumns = columnHelper.columns([
  columnHelper.accessor("displayName", {
    id: "displayName",
    header: "Name",
    enableHiding: false,
    enableSorting: false,
    meta: {
      minWidth: 12,
      sticky: true
    },
    cell: ({ row }) => {
      const { displayName, id, nationality, rsn } = row.original;
      const rsnLine = [rsn.main, rsn.alt].filter(Boolean).join(" / ");

      return (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="inline-flex items-center gap-2 font-medium">
            <Link
              to="/members/$memberId"
              params={{ memberId: id.toString() }}
              className="link link-hover"
            >
              {displayName}
            </Link>
            {nationality && <NationalityFlag value={nationality} />}
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
      return (
        <span className="inline-flex items-center gap-2">
          {rank.iconUrl && (
            <img
              src={rank.iconUrl}
              alt=""
              className="size-4"
            />
          )}
          {rank.name}
        </span>
      );
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

export const defaultColumnVisibility = {
  claimedTier: false,
  masterDiaries: false
};
