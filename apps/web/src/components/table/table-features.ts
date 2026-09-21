import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures
} from "@tanstack/react-table";

import type { CellLayout } from "@/lib/ui/table";

// The column meta is the cell layout, so a column declares once how its cells look.
export type DataTableColumnMeta = CellLayout;

export const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<DataTableColumnMeta>(),
  columnVisibilityFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel()
});

export type DataTableFeatures = typeof dataTableFeatures;
