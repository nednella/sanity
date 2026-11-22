import type { ReactTable, RowData } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features";
import { Button } from "@/lib/ui/button";
import { ButtonGroup } from "@/lib/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";

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
  const items = pageSizeOptions.map((size) => ({
    label: `${size} rows`,
    value: size
  }));

  function handlePageSizeChange(size: number | null) {
    if (size !== null) table.setPageSize(size);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        Showing {start.toLocaleString()}–{end.toLocaleString()} of {rowCount.toLocaleString()}
      </span>
      <div className="flex items-center gap-3">
        <Select
          items={items}
          onValueChange={handlePageSizeChange}
          value={pageSize}
        >
          <SelectTrigger
            aria-label="Rows per page"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PageNavigation table={table} />
      </div>
    </div>
  );
}

type PageNavigationProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
};

function PageNavigation<TData extends RowData>({ table }: Readonly<PageNavigationProps<TData>>) {
  return (
    <ButtonGroup>
      <Button
        aria-label="First page"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.firstPage()}
        size="icon-sm"
        variant="outline"
      >
        <ChevronsLeft />
      </Button>
      <Button
        aria-label="Previous page"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        size="icon-sm"
        variant="outline"
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label="Next page"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        size="icon-sm"
        variant="outline"
      >
        <ChevronRight />
      </Button>
      <Button
        aria-label="Last page"
        disabled={!table.getCanNextPage()}
        onClick={() => table.lastPage()}
        size="icon-sm"
        variant="outline"
      >
        <ChevronsRight />
      </Button>
    </ButtonGroup>
  );
}
