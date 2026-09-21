import type { Header, ReactTable, RowData } from "@tanstack/react-table";
import { ArrowUp } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features";
import { cn } from "@/lib/ui/utils";

const toAriaSort = (canSort: boolean, sorted: false | "asc" | "desc") => {
  if (!canSort) return;
  if (sorted === "asc") return "ascending";
  if (sorted === "desc") return "descending";
  return "none";
};

type DataTableHeaderProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableHeader<TData extends RowData>({ table }: Readonly<DataTableHeaderProps<TData>>) {
  // Read sorting from the selected state rather than the column builders, which the React
  // Compiler cannot see, so a sort change actually re-renders these cells.
  const sortedOf = (columnId: string) => {
    const sorted = table.state.sorting?.find((entry) => entry.id === columnId);
    if (!sorted) return false;
    return sorted.desc ? "desc" : "asc";
  };

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className="bg-base-100"
        >
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta;
            const isAlignedRight = Boolean(meta?.numeric || meta?.align === "right");

            return (
              <th
                key={header.id}
                scope="col"
                aria-sort={toAriaSort(header.column.getCanSort(), sortedOf(header.column.id))}
                className={cn(
                  "whitespace-nowrap",
                  isAlignedRight && "text-right",
                  meta?.sticky && "sticky left-0 z-20 border-r border-base-content/5 bg-inherit"
                )}
                style={{ minWidth: meta?.minWidth && `${meta.minWidth}rem` }}
              >
                <HeaderCell
                  isAlignedRight={isAlignedRight}
                  header={header}
                  sorted={sortedOf(header.column.id)}
                  table={table}
                />
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

type HeaderCellProps<TData extends RowData> = {
  isAlignedRight: boolean;
  header: Header<DataTableFeatures, TData, unknown>;
  sorted: false | "asc" | "desc";
  table: ReactTable<DataTableFeatures, TData>;
};

function HeaderCell<TData extends RowData>({
  isAlignedRight,
  header,
  sorted,
  table
}: Readonly<HeaderCellProps<TData>>) {
  if (header.isPlaceholder) return;

  if (!header.column.getCanSort()) return <table.FlexRender header={header} />;

  return (
    <button
      type="button"
      className={cn("flex w-full cursor-pointer items-center gap-1 font-semibold", isAlignedRight && "justify-end")}
      onClick={header.column.getToggleSortingHandler()}
    >
      <span className="whitespace-nowrap">
        <table.FlexRender header={header} />
      </span>
      <ArrowUp
        className={cn(
          "size-3.5 shrink-0 transition-transform",
          sorted ? "text-base-content" : "text-base-content/30",
          sorted === "desc" && "rotate-180"
        )}
      />
    </button>
  );
}
