import type { Header, ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/components/table/table-features";
import type { Sorted } from "@/lib/ui/table";
import { Table } from "@/lib/ui/table";

const toAriaSort = (canSort: boolean, sorted: Sorted) => {
  if (!canSort) return;
  if (!sorted) return "none";
  return sorted === "asc" ? "ascending" : "descending";
};

type DataTableHeaderProps<TData extends RowData> = {
  stickyHeader?: boolean;
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableHeader<TData extends RowData>({
  stickyHeader = false,
  table
}: Readonly<DataTableHeaderProps<TData>>) {
  // Read sorting from the selected state rather than the column builders, which the React
  // Compiler cannot see, so a sort change actually re-renders these cells.
  const sortedOf = (columnId: string): Sorted => {
    const sorted = table.state.sorting?.find((entry) => entry.id === columnId);
    if (!sorted) return false;
    return sorted.desc ? "desc" : "asc";
  };

  return (
    <Table.Head>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.HeadRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta;
            const sorted = sortedOf(header.column.id);

            return (
              <Table.HeadCell
                key={header.id}
                align={meta?.align}
                minWidth={meta?.minWidth}
                numeric={meta?.numeric}
                pinned={meta?.pinned}
                sticky={stickyHeader}
                aria-sort={toAriaSort(header.column.getCanSort(), sorted)}
              >
                <HeaderCell
                  header={header}
                  sorted={sorted}
                  table={table}
                />
              </Table.HeadCell>
            );
          })}
        </Table.HeadRow>
      ))}
    </Table.Head>
  );
}

type HeaderCellProps<TData extends RowData> = {
  header: Header<DataTableFeatures, TData, unknown>;
  sorted: Sorted;
  table: ReactTable<DataTableFeatures, TData>;
};

function HeaderCell<TData extends RowData>({ header, sorted, table }: Readonly<HeaderCellProps<TData>>) {
  if (header.isPlaceholder) return;

  if (!header.column.getCanSort()) return <table.FlexRender header={header} />;

  return (
    <Table.SortButton
      sorted={sorted}
      reverse={header.column.columnDef.meta?.numeric}
      onClick={header.column.getToggleSortingHandler()}
    >
      <table.FlexRender header={header} />
    </Table.SortButton>
  );
}
