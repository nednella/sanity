import type { ReactTable, RowData } from "@tanstack/react-table";
import { cn } from "cn";
import type { ReactNode } from "react";

import { type DataTableFeatures, cellLayoutClasses } from "@/components/table/table-features";
import { Button } from "@/lib/ui/button";
import { Empty, EmptyContent, EmptyDescription } from "@/lib/ui/empty";
import { Skeleton } from "@/lib/ui/skeleton";
import { TableCell, TableRow } from "@/lib/ui/table";

const SKELETON_ROW_COUNT = 10;

const cursors = {
  pointer: "cursor-pointer",
  "zoom-in": "cursor-zoom-in"
};

type DataTableRowsProps<TData extends RowData> = {
  emptyMessage: string;
  error: Error | null;
  isLoading: boolean;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  pinRow?: (row: TData) => boolean;
  rowCursor?: keyof typeof cursors;
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableRows<TData extends RowData>({
  emptyMessage,
  error,
  isLoading,
  onRetry,
  onRowClick,
  pinRow,
  rowCursor = "pointer",
  table
}: Readonly<DataTableRowsProps<TData>>) {
  const columnCount = table.getVisibleLeafColumns().length;

  if (isLoading) return <SkeletonRows columnCount={columnCount} />;

  if (error) {
    return (
      <ErrorRow
        colSpan={columnCount}
        error={error}
        onRetry={onRetry}
      />
    );
  }

  const { rows } = table.getRowModel();
  // Sorting only moves the loose rows. Pinned ones keep the order they arrived
  // in, which row.index still holds after the sorted row model has reordered
  // them.
  const pinned = pinRow ? rows.filter((row) => pinRow(row.original)).toSorted((a, b) => a.index - b.index) : [];
  const ordered = pinRow ? [...pinned, ...rows.filter((row) => !pinRow(row.original))] : rows;

  if (ordered.length === 0) {
    return (
      <MessageRow colSpan={columnCount}>
        <EmptyDescription className="text-sm">{emptyMessage}</EmptyDescription>
      </MessageRow>
    );
  }

  return ordered.map((row) => {
    const select = onRowClick && (() => onRowClick(row.original));

    return (
      <TableRow
        className={cn(
          "h-12 bg-background",
          select && cursors[rowCursor],
          select &&
            `
              outline-none
              focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring
              focus-visible:outline-solid
            `
        )}
        key={row.id}
        onClick={select && ((event) => selectUnlessControl(event, select))}
        onKeyDown={select && ((event) => selectOnKey(event, select))}
        tabIndex={select ? 0 : undefined}
      >
        {row.getVisibleCells().map((cell) => {
          const layout = cell.column.columnDef.meta;

          return (
            <TableCell
              className={cn("whitespace-normal", cellLayoutClasses(layout), layout?.pinned && "z-10")}
              key={cell.id}
            >
              <table.FlexRender cell={cell} />
            </TableCell>
          );
        })}
      </TableRow>
    );
  });
}

// A click landing on a link or button inside the row belongs to that control
// rather than the row.
function selectUnlessControl(event: React.MouseEvent, select: () => void) {
  const { target } = event;
  if (target instanceof HTMLElement && target.closest("a, button")) return;
  select();
}

function selectOnKey(event: React.KeyboardEvent, select: () => void) {
  if (event.target !== event.currentTarget) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  select();
}

type ErrorRowProps = {
  colSpan: number;
  error: Error;
  onRetry?: () => void;
};

function ErrorRow({ colSpan, error, onRetry }: Readonly<ErrorRowProps>) {
  return (
    <MessageRow colSpan={colSpan}>
      <EmptyDescription className="text-sm">{error.message}</EmptyDescription>
      {onRetry && (
        <EmptyContent>
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
          >
            Retry
          </Button>
        </EmptyContent>
      )}
    </MessageRow>
  );
}

function SkeletonRows({ columnCount }: Readonly<{ columnCount: number }>) {
  return Array.from({ length: SKELETON_ROW_COUNT }, (_, row) => (
    <TableRow
      className="h-12"
      key={row}
    >
      {Array.from({ length: columnCount }, (_, column) => (
        <TableCell key={column}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

type MessageRowProps = {
  children: ReactNode;
  colSpan: number;
};

function MessageRow({ children, colSpan }: Readonly<MessageRowProps>) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        className="py-10"
        colSpan={colSpan}
      >
        <Empty className="p-0">{children}</Empty>
      </TableCell>
    </TableRow>
  );
}
