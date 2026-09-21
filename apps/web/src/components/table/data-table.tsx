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

import { DataTableBody } from "@/components/table/data-table-body";
import { DataTableColumnToggle } from "@/components/table/data-table-column-toggle";
import { DataTableHeader } from "@/components/table/data-table-header";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableSearch } from "@/components/table/data-table-search";
import type { DataTableFeatures } from "@/components/table/table-features";
import { dataTableFeatures } from "@/components/table/table-features";
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
  search?: { onChange: (value: string) => void; placeholder?: string; value: string };
  rowCount?: number;
  sorting?: SortingState;
  stickyHeader?: boolean;
  toolbar?: (table: ReactTable<DataTableFeatures, TData>) => ReactNode;
};

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
  const isServerPagination = pagination !== undefined;
  const isServerSorting = sorting !== undefined;

  // The React Compiler cannot see state read through the table's builder methods, so the
  // slices the header and body render from are selected explicitly to trigger re-renders.
  const table = useTable<DataTableFeatures, TData, TableState<DataTableFeatures>>(
    {
      columns,
      data,
      enableSortingRemoval,
      features: dataTableFeatures,
      initialState: {
        columnVisibility: initialColumnVisibility,
        pagination: {
          pageIndex: 0,
          pageSize: isServerPagination ? (pageSizeOptions[0] ?? 50) : UNPAGINATED_PAGE_SIZE
        }
      },
      manualPagination: isServerPagination,
      manualSorting: isServerSorting,
      sortDescFirst: false,
      // An explicit `undefined` would wipe out the handler the table falls back to, and would pin
      // that state slice to its initial value, so a slice the server doesn't drive is left out.
      ...(onPaginationChange && { onPaginationChange }),
      ...(onSortingChange && { onSortingChange }),
      ...(rowCount !== undefined && { rowCount }),
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

  const columnCount = table.getVisibleLeafColumns().length;
  const canToggleColumns = table.getAllLeafColumns().some((column) => column.getCanHide());
  const hasToolbar = Boolean(search) || Boolean(toolbar) || canToggleColumns;

  return (
    <Table.Shell>
      {hasToolbar && (
        <Table.Toolbar
          actions={
            <>
              {toolbar?.(table)}
              {canToggleColumns && <DataTableColumnToggle table={table} />}
            </>
          }
        >
          {search && <DataTableSearch {...search} />}
        </Table.Toolbar>
      )}

      <Table scroll={!stickyHeader}>
        <DataTableHeader
          table={table}
          stickyHeader={stickyHeader}
        />
        <Table.Body>
          <DataTableBody
            table={table}
            columnCount={columnCount}
            emptyMessage={emptyMessage}
            error={error}
            isLoading={isLoading}
            onRetry={onRetry}
            onRowClick={onRowClick}
            pinRow={pinRow}
          />
        </Table.Body>
      </Table>

      {isServerPagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </Table.Shell>
  );
}
