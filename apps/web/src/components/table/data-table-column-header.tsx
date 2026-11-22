import { cn } from "cn";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";

import { type CellLayout, cellLayoutClasses } from "@/components/table/table-features";
import { TableHead } from "@/lib/ui/table";

export type Sorted = "asc" | "desc" | false;

type DataTableColumnHeaderProps = {
  children: ReactNode;
  layout?: CellLayout;
  // A header with a handler sorts the column when clicked, and says which way
  // it is sorted now.
  onSort?: React.MouseEventHandler<HTMLButtonElement>;
  sorted?: Sorted;
  // Sticks to the top of the page, offset by the height of the site header.
  sticky?: boolean;
};

export function DataTableColumnHeader({
  children,
  layout,
  onSort,
  sorted,
  sticky = false
}: Readonly<DataTableColumnHeaderProps>) {
  return (
    <TableHead
      aria-sort={toAriaSort(sorted)}
      className={cn(cellLayoutClasses(layout), layout?.pinned && "z-20", sticky && "sticky top-12 z-20 bg-background")}
      scope="col"
      style={{ minWidth: layout?.minWidth && `${layout.minWidth}rem` }}
    >
      {onSort ? (
        <SortButton
          onClick={onSort}
          reverse={layout?.numeric}
          sorted={sorted ?? false}
        >
          {children}
        </SortButton>
      ) : (
        children
      )}
    </TableHead>
  );
}

// Undefined means the column cannot be sorted at all, which is not the same as
// sortable and unsorted.
function toAriaSort(sorted: Sorted | undefined) {
  if (sorted === undefined) return;
  if (!sorted) return "none";
  return sorted === "asc" ? "ascending" : "descending";
}

type SortButtonProps = {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  // A right-aligned column reads better with the icon on the left, beside the
  // numbers.
  reverse?: boolean;
  sorted: Sorted;
};

function SortButton({ children, onClick, reverse = false, sorted }: Readonly<SortButtonProps>) {
  return (
    <button
      className={cn(
        `
          inline-flex items-center gap-1
          hover:text-foreground
        `,
        reverse && "flex-row-reverse"
      )}
      onClick={onClick}
      type="button"
    >
      <span className="whitespace-nowrap">{children}</span>
      <SortIcon sorted={sorted} />
    </button>
  );
}

function SortIcon({ sorted }: Readonly<{ sorted: Sorted }>) {
  if (!sorted) return <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/50" />;
  if (sorted === "asc") return <ArrowUp className="size-3.5 shrink-0" />;
  return <ArrowDown className="size-3.5 shrink-0" />;
}
