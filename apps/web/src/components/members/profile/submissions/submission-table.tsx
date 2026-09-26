import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { ParticipantList } from "@/components/members/profile/submissions/participant-list";
import { DataTable } from "@/components/table/data-table";
import type { DataTableFeatures } from "@/components/table/table-features";
import type { Page, Submission } from "@/lib/api/types";
import { useMediaStore } from "@/lib/media/media.store";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { useTableSearch } from "@/lib/table/use-table-search";
import { RelativeDate } from "@/lib/ui/relative-date";
import { DASH } from "@/utils/dash";
import { formatNumber } from "@/utils/numbers";

const columnHelper = createColumnHelper<DataTableFeatures, Submission>();

const buildColumns = (memberId: string) =>
  columnHelper.columns([
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
    columnHelper.accessor("participants", {
      id: "participants",
      header: "Points",
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

type SubmissionTableProps = {
  data: { items: Submission[]; page: Page } | undefined;
  error: Error | null;
  isLoading: boolean;
  memberId: string;
  onRetry: () => void;
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

export function SubmissionTable({
  data,
  error,
  isLoading,
  memberId,
  onRetry,
  search,
  toolbar
}: Readonly<SubmissionTableProps>) {
  const { showMedia } = useMediaStore();
  const table = useTableSearch(search);
  const columns = buildColumns(memberId);

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
