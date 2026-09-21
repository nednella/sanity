import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures
} from "@tanstack/react-table";

export type DataTableColumnMeta = {
  align?: "left" | "right";
  minWidth?: number;
  numeric?: boolean;
  pinned?: boolean;
};

export const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<DataTableColumnMeta>(),
  columnVisibilityFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel()
});

export type DataTableFeatures = typeof dataTableFeatures;
