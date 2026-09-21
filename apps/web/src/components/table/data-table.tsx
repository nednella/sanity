import type {
  ColumnDef,
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  ReactTable,
  RowData,
  SortingState,
  TableState
} from "@tanstack/react-table";
import { useTable } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { DataTableColumnToggle } from "@/components/table/data-table-column-toggle";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import type { DataTableFeatures } from "@/components/table/table-features";
import { dataTableFeatures } from "@/components/table/table-features";
import { Button } from "@/lib/ui/button";
import type { Sorted } from "@/lib/ui/table";
import { Table } from "@/lib/ui/table";

const DEFAULT_PAGE_SIZE_OPTIONS = [50, 100, 200];

// Enough rows that a table the server doesn't paginate shows everything it was given.
const UNPAGINATED_PAGE_SIZE = 10_000;

// A stable reference, so a table waiting on its first page doesn't remount its rows.
const NO_ROWS: never[] = [];

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[] | undefined;
  emptyMessage?: string;
  enableSortingRemoval?: boolean;
  error?: Error | null;
  initialColumnVisibility?: ColumnVisibilityState;
  isLoading?: boolean;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  onSortingChange?: OnChangeFn<SortingState>;
  pageSizeOptions?: number[];
  pagination?: PaginationState;
  pinRow?: (row: TData) => boolean;
  rowCount?: number;
  search?: { onChange: (value: string) => void; placeholder?: string; value: string };
  sorting?: SortingState;
  stickyHeader?: boolean;
  toolbar?: ReactNode;
};

// Passing a state slice and its change handler is what hands that slice to the server; leaving both
// out lets the table manage it. They stay conditional because an explicit `undefined` would wipe out
// the handler the table defaults to.
export function DataTable<TData extends RowData>({
  columns,
  data = NO_ROWS,
  emptyMessage = "No results.",
  enableSortingRemoval = false,
  error = null,
  initialColumnVisibility = {},
  isLoading = false,
  onPaginationChange,
  onRetry,
  onRowClick,
  onSortingChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pagination,
  pinRow,
  rowCount,
  search,
  sorting,
  stickyHeader = false,
  toolbar
}: Readonly<DataTableProps<TData>>) {
  // The React Compiler cannot see state read through the table's builder methods, so the slices the
  // header and rows render from are selected explicitly to trigger re-renders.
  const table = useTable<DataTableFeatures, TData, TableState<DataTableFeatures>>(
    {
      columns,
      data,
      enableSortingRemoval,
      features: dataTableFeatures,
      initialState: {
        columnVisibility: initialColumnVisibility,
        pagination: { pageIndex: 0, pageSize: pagination?.pageSize ?? UNPAGINATED_PAGE_SIZE }
      },
      manualPagination: pagination !== undefined,
      manualSorting: sorting !== undefined,
      rowCount,
      sortDescFirst: false,
      ...(onPaginationChange && { onPaginationChange }),
      ...(onSortingChange && { onSortingChange }),
      state: {
        ...(pagination && { pagination }),
        ...(sorting && { sorting })
      }
    },
    (state) => ({
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
      sorting: state.sorting
    })
  );

  const sortedOf = (columnId: string): Sorted => {
    const entry = table.state.sorting?.find((sort) => sort.id === columnId);
    return entry ? (entry.desc ? "desc" : "asc") : false;
  };

  const canToggleColumns = table.getAllLeafColumns().some((column) => column.getCanHide());

  return (
    <Table.Shell>
      {(search || toolbar || canToggleColumns) && (
        <Table.Toolbar
          actions={
            <>
              {toolbar}
              {canToggleColumns && <DataTableColumnToggle table={table} />}
            </>
          }
        >
          {search && <Table.Search {...search} />}
        </Table.Toolbar>
      )}

      <Table scroll={!stickyHeader}>
        <Table.Head>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.HeadRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort();

                return (
                  <Table.HeadCell
                    key={header.id}
                    layout={header.column.columnDef.meta}
                    onSort={sortable ? header.column.getToggleSortingHandler() : undefined}
                    sorted={sortable ? sortedOf(header.column.id) : undefined}
                    sticky={stickyHeader}
                  >
                    <table.FlexRender header={header} />
                  </Table.HeadCell>
                );
              })}
            </Table.HeadRow>
          ))}
        </Table.Head>
        <Table.Body>
          <Rows
            emptyMessage={emptyMessage}
            error={error}
            isLoading={isLoading}
            onRetry={onRetry}
            onRowClick={onRowClick}
            pinRow={pinRow}
            table={table}
          />
        </Table.Body>
      </Table>

      {pagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </Table.Shell>
  );
}

type RowsProps<TData extends RowData> = {
  emptyMessage: string;
  error: Error | null;
  isLoading: boolean;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  pinRow?: (row: TData) => boolean;
  table: ReactTable<DataTableFeatures, TData>;
};

function Rows<TData extends RowData>({
  emptyMessage,
  error,
  isLoading,
  onRetry,
  onRowClick,
  pinRow,
  table
}: Readonly<RowsProps<TData>>) {
  const columnCount = table.getVisibleLeafColumns().length;

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
  // Sorting only moves the loose rows. Pinned ones keep the order they arrived in, which row.index
  // still holds after the sorted row model has reordered them.
  const pinned = pinRow ? rows.filter((row) => pinRow(row.original)).toSorted((a, b) => a.index - b.index) : [];
  const ordered = pinRow ? [...pinned, ...rows.filter((row) => !pinRow(row.original))] : rows;

  if (ordered.length === 0) return <Table.Message colSpan={columnCount}>{emptyMessage}</Table.Message>;

  return ordered.map((row) => (
    <Table.Row
      key={row.id}
      onSelect={onRowClick && (() => onRowClick(row.original))}
    >
      {row.getVisibleCells().map((cell) => (
        <Table.Cell
          key={cell.id}
          layout={cell.column.columnDef.meta}
        >
          <table.FlexRender cell={cell} />
        </Table.Cell>
      ))}
    </Table.Row>
  ));
}
