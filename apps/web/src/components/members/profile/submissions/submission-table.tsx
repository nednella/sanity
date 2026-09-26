import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Page, Submission } from "@/lib/api/types";
import { useMediaStore } from "@/lib/media/media.store";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { useTableSearch } from "@/lib/table/use-table-search";
import { DASH } from "@/utils/dash";
import { formatDate } from "@/utils/dates";
import { formatNumber } from "@/utils/numbers";

const columnHelper = createColumnHelper<DataTableFeatures, Submission>();

const columns = columnHelper.columns([
  columnHelper.accessor("item.name", {
    id: "item",
    header: "Item",
    enableHiding: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) => <span className="font-medium">{getValue() ?? DASH}</span>
  }),
  columnHelper.accessor("valueMillions", {
    id: "valueMillions",
    header: "Value",
    meta: {
      minWidth: 6,
      numeric: true
    },
    cell: ({ getValue }) => {
      const value = getValue();
      return value === null ? DASH : `${formatNumber(value)}m`;
    }
  }),
  columnHelper.accessor("event", {
    id: "event",
    header: "Event",
    enableSorting: false,
    meta: { minWidth: 6 },
    cell: ({ getValue }) => getValue() ?? DASH
  }),
  columnHelper.accessor("participants", {
    id: "participants",
    header: "Split With",
    enableSorting: false,
    meta: { minWidth: 14 },
    cell: ({ getValue }) => {
      const split = getValue().map(
        ({ displayName, points }) => `${displayName} (${points === null ? DASH : formatNumber(points)})`
      );

      return split.length > 0 ? split.join(", ") : DASH;
    }
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

type SubmissionTableProps = {
  data: { items: Submission[]; page: Page } | undefined;
  error: Error | null;
  isLoading: boolean;
  onRetry: () => void;
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

export function SubmissionTable({ data, error, isLoading, onRetry, search, toolbar }: Readonly<SubmissionTableProps>) {
  const { showMedia } = useMediaStore();
  const table = useTableSearch(search);

  const openScreenshot = ({ imageUrl, item }: Submission) => {
    if (!imageUrl) return;

    showMedia({ alt: item.name ?? "Drop submission", src: imageUrl });
  };

  return (
    <DataTable
      columns={columns}
      data={data?.items}
      emptyMessage="No drops submitted."
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
