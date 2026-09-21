import type { ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/components/table/table-features";
import { Button } from "@/lib/ui/button";
import { Table } from "@/lib/ui/table";

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
  if (isLoading) return <Table.Skeleton columnCount={columnCount} />;

  if (error) {
    return (
      <Table.Message colSpan={columnCount}>
        <p>{error.message}</p>
        {onRetry && (
          <Button
            size="sm"
            variant="custom"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </Table.Message>
    );
  }

  const rows = table.getRowModel().rows;
  // Pinned rows keep the order they arrived in, so sorting a column can't reshuffle them.
  const pinned = pinRow ? rows.filter((row) => pinRow(row.original)).toSorted((a, b) => a.index - b.index) : [];
  const ordered = pinRow ? [...pinned, ...rows.filter((row) => !pinRow(row.original))] : rows;

  if (ordered.length === 0) return <Table.Message colSpan={columnCount}>{emptyMessage}</Table.Message>;

  return ordered.map((row) => (
    <Table.Row
      key={row.id}
      onSelect={onRowClick && (() => onRowClick(row.original))}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;

        return (
          <Table.Cell
            key={cell.id}
            align={meta?.align}
            numeric={meta?.numeric}
            pinned={meta?.pinned}
          >
            <table.FlexRender cell={cell} />
          </Table.Cell>
        );
      })}
    </Table.Row>
  ));
}
