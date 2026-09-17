import type { ReactTable, RowData } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features.js";

type DataTablePaginationProps<TData extends RowData> = {
  pageSizeOptions: number[];
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTablePagination<TData extends RowData>({
  pageSizeOptions,
  table
}: Readonly<DataTablePaginationProps<TData>>) {
  const rowCount = table.getRowCount();
  const { pageIndex, pageSize } = table.state.pagination;
  const start = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(rowCount, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-base-content/60">
      <span>
        Showing {start.toLocaleString()}–{end.toLocaleString()} of {rowCount.toLocaleString()}
      </span>
      <div className="flex items-center gap-3">
        <select
          aria-label="Rows per page"
          className="select w-auto select-sm"
          value={pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option
              key={size}
              value={size}
            >
              {size} rows
            </option>
          ))}
        </select>
        <div className="join">
          <button
            type="button"
            aria-label="First page"
            className="btn join-item btn-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          >
            <ChevronsLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Previous page"
            className="btn join-item btn-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="btn join-item btn-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Last page"
            className="btn join-item btn-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}
          >
            <ChevronsRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
