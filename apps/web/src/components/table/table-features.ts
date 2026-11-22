import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures
} from "@tanstack/react-table";
import { cn } from "cn";

export type CellLayout = {
  align?: "left" | "right";
  minWidth?: number;
  numeric?: boolean;
  // A pinned cell stays put while the table scrolls sideways.
  pinned?: boolean;
};

// The column meta is the cell layout, so a column declares once how its cells
// look.
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

export function cellLayoutClasses({ align, numeric, pinned }: CellLayout = {}) {
  return cn(
    numeric && "tabular-nums",
    (numeric || align === "right") && "text-right",
    pinned && "sticky left-0 border-r border-foreground/5 bg-inherit"
  );
}
