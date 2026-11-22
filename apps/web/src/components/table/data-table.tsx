import {
  type ColumnDef,
  type ColumnVisibilityState,
  type OnChangeFn,
  type PaginationState,
  type ReactTable,
  type RowData,
  type SortingState,
  type TableState,
  useTable
} from "@tanstack/react-table";
import type { ReactNode } from "react";

import { DataTableColumnHeader, type Sorted } from "@/components/table/data-table-column-header";
import { DataTableColumnToggle } from "@/components/table/data-table-column-toggle";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableRows } from "@/components/table/data-table-rows";
import { DataTableSearch } from "@/components/table/data-table-search";
import { type DataTableFeatures, dataTableFeatures } from "@/components/table/table-features";
import { PAGE_SIZES } from "@/lib/table/search";
import { Table, TableBody, TableHeader, TableRow } from "@/lib/ui/table";

// Enough rows that a table the server doesn't paginate shows everything it was
// given.
const UNPAGINATED_PAGE_SIZE = 10_000;

// A stable reference, so a table waiting on its first page doesn't remount its
// rows.
const NO_ROWS: never[] = [];

type TableOptions<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[] | undefined;
  initialColumnVisibility?: ColumnVisibilityState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  rowCount?: number;
  sorting?: SortingState;
};

type DataTableProps<TData extends RowData> = {
  emptyMessage?: string;
  error?: Error | null;
  filters?: ReactNode;
  isLoading?: boolean;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  pageSizeOptions?: number[];
  pinRow?: (row: TData) => boolean;
  // What a click on a row does: follow it, or open the picture it carries.
  rowCursor?: "pointer" | "zoom-in";
  search?: { onChange: (value: string) => void; placeholder?: string; value: string };
  stickyHeader?: boolean;
  tableOptions: TableOptions<TData>;
  toolbar?: ReactNode;
};

export function DataTable<TData extends RowData>({
  emptyMessage = "No results.",
  error = null,
  filters,
  isLoading = false,
  onRetry,
  onRowClick,
  pageSizeOptions = PAGE_SIZES,
  pinRow,
  rowCursor,
  search,
  stickyHeader = false,
  tableOptions,
  toolbar
}: Readonly<DataTableProps<TData>>) {
  const table = useDataTable(tableOptions);

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        filters={filters}
        search={search}
        table={table}
        toolbar={toolbar}
      />

      <DataTableGrid
        stickyHeader={stickyHeader}
        table={table}
      >
        <DataTableRows
          emptyMessage={emptyMessage}
          error={error}
          isLoading={isLoading}
          onRetry={onRetry}
          onRowClick={onRowClick}
          pinRow={pinRow}
          rowCursor={rowCursor}
          table={table}
        />
      </DataTableGrid>

      {tableOptions.pagination && (
        <DataTablePagination
          pageSizeOptions={pageSizeOptions}
          table={table}
        />
      )}
    </div>
  );
}

// Passing a state slice and its change handler is what hands that slice to the
// server; leaving both out lets the table manage it. They stay conditional
// because an explicit `undefined` would wipe out the handler the table defaults
// to.
function useDataTable<TData extends RowData>({
  columns,
  data = NO_ROWS,
  initialColumnVisibility = {},
  onPaginationChange,
  onSortingChange,
  pagination,
  rowCount,
  sorting
}: Readonly<TableOptions<TData>>) {
  // The React Compiler cannot see state read through the table's builder
  // methods, so the slices the header and rows render from are selected
  // explicitly to trigger re-renders.
  return useTable<DataTableFeatures, TData, TableState<DataTableFeatures>>(
    {
      columns,
      data,
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
}

type DataTableToolbarProps<TData extends RowData> = {
  filters?: ReactNode;
  search?: DataTableProps<TData>["search"];
  table: ReactTable<DataTableFeatures, TData>;
  toolbar?: ReactNode;
};

function DataTableToolbar<TData extends RowData>({
  filters,
  search,
  table,
  toolbar
}: Readonly<DataTableToolbarProps<TData>>) {
  const canToggleColumns = table.getAllLeafColumns().some((column) => column.getCanHide());
  const hasControls = Boolean(search || filters || toolbar || canToggleColumns);

  if (!hasControls) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {search && <DataTableSearch {...search} />}
      {filters}
      <div
        className="
          flex flex-wrap items-center gap-3
          md:ms-auto
        "
      >
        {toolbar}
        {canToggleColumns && <DataTableColumnToggle table={table} />}
      </div>
    </div>
  );
}

type DataTableGridProps<TData extends RowData> = {
  children: ReactNode;
  stickyHeader: boolean;
  table: ReactTable<DataTableFeatures, TData>;
};

function DataTableGrid<TData extends RowData>({ children, stickyHeader, table }: Readonly<DataTableGridProps<TData>>) {
  function sortedOf(columnId: string): Sorted {
    const entry = table.state.sorting?.find((sort) => sort.id === columnId);
    if (!entry) return false;
    return entry.desc ? "desc" : "asc";
  }

  return (
    <div className="border">
      <Table
        className="text-sm [overflow-anchor:none]"
        scroll={!stickyHeader}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="
                bg-background
                hover:bg-background
              "
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort();

                return (
                  <DataTableColumnHeader
                    key={header.id}
                    layout={header.column.columnDef.meta}
                    onSort={sortable ? header.column.getToggleSortingHandler() : undefined}
                    sorted={sortable ? sortedOf(header.column.id) : undefined}
                    sticky={stickyHeader}
                  >
                    <table.FlexRender header={header} />
                  </DataTableColumnHeader>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
