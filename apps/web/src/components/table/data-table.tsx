import type {
  ColumnDef,
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  ReactTable,
  RowData,
  SortingState
} from "@tanstack/react-table";
import { useTable } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { DataTableBody } from "@/components/table/data-table-body";
import { DataTableHeader } from "@/components/table/data-table-header";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import type { DataTableFeatures } from "@/components/table/table-features";
import { dataTableFeatures } from "@/components/table/table-features";

const DEFAULT_PAGE_SIZE_OPTIONS = [50, 100, 200];

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  emptyMessage?: string;
  error?: Error | null;
  initialColumnVisibility?: ColumnVisibilityState;
  isLoading?: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  onSortingChange: OnChangeFn<SortingState>;
  pageSizeOptions?: number[];
  pagination: PaginationState;
  rowCount: number;
  sorting: SortingState;
  toolbar?: (table: ReactTable<DataTableFeatures, TData>) => ReactNode;
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage = "No results.",
  error = null,
  initialColumnVisibility = {},
  isLoading = false,
  onPaginationChange,
  onRetry,
  onRowClick,
  onSortingChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pagination,
  rowCount,
  sorting,
  toolbar
}: Readonly<DataTableProps<TData>>) {
  const table = useTable<DataTableFeatures, TData>({
    columns,
    data,
    enableSortingRemoval: false,
    features: dataTableFeatures,
    initialState: { columnVisibility: initialColumnVisibility },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange,
    onSortingChange,
    rowCount,
    state: {
      pagination,
      sorting
    }
  });

  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <div className="flex flex-col gap-3">
      {toolbar?.(table)}

      <div className="overflow-x-auto rounded-xs border border-base-300">
        <table className="table min-w-full">
          <DataTableHeader table={table} />
          <tbody>
            <DataTableBody
              table={table}
              columnCount={columnCount}
              emptyMessage={emptyMessage}
              error={error}
              isLoading={isLoading}
              onRetry={onRetry}
              onRowClick={onRowClick}
            />
          </tbody>
        </table>
      </div>

      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
