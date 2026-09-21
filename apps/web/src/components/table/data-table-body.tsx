import type { ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/components/table/table-features";
import { cn } from "@/lib/ui/utils";

const SKELETON_ROW_COUNT = 10;

type DataTableBodyProps<TData extends RowData> = {
  columnCount: number;
  emptyMessage: string;
  error: Error | null;
  isLoading: boolean;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  pinRow?: (row: TData) => boolean;
  table: ReactTable<DataTableFeatures, TData>;
};

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest("a, button") !== null;
}

export function DataTableBody<TData extends RowData>({
  columnCount,
  emptyMessage,
  error,
  isLoading,
  onRetry,
  onRowClick,
  pinRow,
  table
}: Readonly<DataTableBodyProps<TData>>) {
  if (isLoading) {
    return Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
      <tr key={rowIndex}>
        {Array.from({ length: columnCount }, (_, columnIndex) => (
          <td key={columnIndex}>
            <div className="h-4 w-full skeleton" />
          </td>
        ))}
      </tr>
    ));
  }

  if (error) {
    return (
      <tr>
        <td
          colSpan={columnCount}
          className="py-10 text-center"
        >
          <p className="text-base-content/60">{error.message}</p>
          {onRetry && (
            <button
              type="button"
              className="btn mt-3 btn-sm"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </td>
      </tr>
    );
  }

  const rows = table.getRowModel().rows;
  // Pinned rows keep the order they arrived in, so sorting a column can't reshuffle them.
  const pinned = pinRow ? rows.filter((row) => pinRow(row.original)).toSorted((a, b) => a.index - b.index) : [];
  const ordered = pinRow ? [...pinned, ...rows.filter((row) => !pinRow(row.original))] : rows;

  if (ordered.length === 0) {
    return (
      <tr>
        <td
          colSpan={columnCount}
          className="py-10 text-center text-base-content/60"
        >
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return ordered.map((row) => (
    <tr
      key={row.id}
      tabIndex={onRowClick ? 0 : undefined}
      className={cn(
        "h-12 bg-base-100 hover:bg-base-200",
        onRowClick &&
          "cursor-pointer focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-primary"
      )}
      onClick={
        onRowClick &&
        ((event) => {
          if (!isInteractiveTarget(event.target)) onRowClick(row.original);
        })
      }
      onKeyDown={
        onRowClick &&
        ((event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onRowClick(row.original);
        })
      }
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className={cn(
            cell.column.columnDef.meta?.numeric && "tabular-nums",
            (cell.column.columnDef.meta?.numeric || cell.column.columnDef.meta?.align === "right") && "text-right",
            cell.column.columnDef.meta?.sticky && "sticky left-0 z-10 border-r border-base-content/5 bg-inherit"
          )}
        >
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ));
}
