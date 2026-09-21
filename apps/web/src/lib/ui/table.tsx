import { ArrowDown, ArrowUp, ChevronsUpDown, Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/ui/utils";

export type Sorted = false | "asc" | "desc";

export type CellLayout = {
  align?: "left" | "right";
  minWidth?: number;
  numeric?: boolean;
  // A pinned cell stays put while the table scrolls sideways.
  pinned?: boolean;
};

const layoutClasses = ({ align, numeric, pinned }: CellLayout = {}) =>
  cn(
    numeric && "tabular-nums",
    (numeric || align === "right") && "text-right",
    pinned && "sticky left-0 border-r border-base-content/5 bg-inherit"
  );

// The stack a data table sits in: chrome above, the table itself, pagination below.
function Shell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

type ToolbarProps = {
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

function Toolbar({ actions, children }: Readonly<ToolbarProps>) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {children}
      <div className="flex flex-wrap items-center gap-3 md:ms-auto">{actions}</div>
    </div>
  );
}

type RootProps = React.ComponentPropsWithRef<"table"> & {
  // A scroll container is its own sticky context, so a table whose header sticks to the page cannot
  // also scroll sideways.
  scroll?: boolean;
};

export function Table({ className, scroll = true, ...props }: Readonly<RootProps>) {
  return (
    <div className={cn("rounded-xs border border-base-300", scroll && "overflow-x-auto")}>
      <table
        className={cn("table min-w-full [overflow-anchor:none]", className)}
        {...props}
      />
    </div>
  );
}

function Head(props: Readonly<React.ComponentPropsWithRef<"thead">>) {
  return <thead {...props} />;
}

function HeadRow({ className, ...props }: Readonly<React.ComponentPropsWithRef<"tr">>) {
  return (
    <tr
      className={cn("bg-base-100", className)}
      {...props}
    />
  );
}

// Undefined means the column cannot be sorted at all, which is not the same as sortable and unsorted.
const toAriaSort = (sorted: Sorted | undefined) => {
  if (sorted === undefined) return;
  if (!sorted) return "none";
  return sorted === "asc" ? "ascending" : "descending";
};

type HeadCellProps = React.ComponentPropsWithRef<"th"> & {
  layout?: CellLayout;
  // A cell with a handler sorts the column when clicked, and says which way it is sorted now.
  onSort?: React.MouseEventHandler<HTMLButtonElement>;
  sorted?: Sorted;
  // Sticks to the top of the page, offset by the height of the site header.
  sticky?: boolean;
};

function HeadCell({ children, className, layout, onSort, sorted, sticky, ...props }: Readonly<HeadCellProps>) {
  return (
    <th
      scope="col"
      aria-sort={toAriaSort(sorted)}
      className={cn(
        "whitespace-nowrap",
        layoutClasses(layout),
        layout?.pinned && "z-20",
        sticky && "sticky top-12 z-20 bg-base-100",
        className
      )}
      style={{ minWidth: layout?.minWidth && `${layout.minWidth}rem` }}
      {...props}
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
    </th>
  );
}

type SortButtonProps = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  // A right-aligned column reads better with the icon on the left, beside the numbers.
  reverse?: boolean;
  sorted: Sorted;
};

function SortButton({ children, onClick, reverse = false, sorted }: Readonly<SortButtonProps>) {
  return (
    <button
      type="button"
      className={cn("inline-flex items-center gap-1 hover:text-base-content", reverse && "flex-row-reverse")}
      onClick={onClick}
    >
      <span className="whitespace-nowrap">{children}</span>
      <SortIcon sorted={sorted} />
    </button>
  );
}

function SortIcon({ sorted }: Readonly<{ sorted: Sorted }>) {
  if (!sorted) return <ChevronsUpDown className="size-3.5 shrink-0 text-base-content/30" />;
  if (sorted === "asc") return <ArrowUp className="size-3.5 shrink-0" />;
  return <ArrowDown className="size-3.5 shrink-0" />;
}

function Body(props: Readonly<React.ComponentPropsWithRef<"tbody">>) {
  return <tbody {...props} />;
}

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.closest("a, button") !== null;

type RowProps = React.ComponentPropsWithRef<"tr"> & {
  onSelect?: () => void;
};

// A row that does something is reachable by keyboard, and a click landing on a link or button inside
// it belongs to that control rather than the row.
function Row({ className, onSelect, ...props }: Readonly<RowProps>) {
  return (
    <tr
      tabIndex={onSelect ? 0 : undefined}
      className={cn(
        "h-12 bg-base-100 hover:bg-base-200",
        onSelect &&
          "cursor-pointer focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-primary",
        className
      )}
      onClick={
        onSelect &&
        ((event) => {
          if (!isInteractiveTarget(event.target)) onSelect();
        })
      }
      onKeyDown={
        onSelect &&
        ((event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onSelect();
        })
      }
      {...props}
    />
  );
}

function Cell({ className, layout, ...props }: Readonly<{ layout?: CellLayout } & React.ComponentPropsWithRef<"td">>) {
  return (
    <td
      className={cn(layoutClasses(layout), layout?.pinned && "z-10", className)}
      {...props}
    />
  );
}

type MessageProps = {
  children: React.ReactNode;
  colSpan: number;
};

function Message({ children, colSpan }: Readonly<MessageProps>) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-10 text-center text-base-content/60"
      >
        {children}
      </td>
    </tr>
  );
}

type SkeletonProps = {
  columnCount: number;
  rowCount?: number;
};

function Skeleton({ columnCount, rowCount = 10 }: Readonly<SkeletonProps>) {
  return Array.from({ length: rowCount }, (_, row) => (
    <tr key={row}>
      {Array.from({ length: columnCount }, (_, column) => (
        <td key={column}>
          <div className="h-4 w-full skeleton" />
        </td>
      ))}
    </tr>
  ));
}

const DEBOUNCE_MS = 300;

type SearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

// The value lives in the URL, but typing shouldn't navigate on every keystroke, so the input holds
// its own state until the typing stops.
function Search({ onChange, placeholder = "Search", value }: Readonly<SearchProps>) {
  const [typed, setTyped] = useState(value);
  const [committed, setCommitted] = useState(value);

  // The URL owns the value, so adopt it when it changes elsewhere: a back navigation, or a filter
  // that resets the search.
  if (value !== committed) {
    setCommitted(value);
    setTyped(value);
  }

  useEffect(() => {
    if (typed === value) return;

    const timer = setTimeout(() => onChange(typed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [onChange, typed, value]);

  return (
    <label className="input w-full max-w-64 rounded-xs input-sm">
      <SearchIcon className="size-4 shrink-0 text-base-content/60" />
      <input
        type="search"
        value={typed}
        placeholder={placeholder}
        className="[&::-webkit-search-cancel-button]:appearance-none"
        onChange={(event) => setTyped(event.target.value)}
      />
      {typed && (
        <button
          type="button"
          aria-label="Clear search"
          className="cursor-pointer text-base-content/60 hover:text-base-content"
          onClick={() => setTyped("")}
        >
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}

Table.Body = Body;
Table.Cell = Cell;
Table.Head = Head;
Table.HeadCell = HeadCell;
Table.HeadRow = HeadRow;
Table.Message = Message;
Table.Row = Row;
Table.Search = Search;
Table.Shell = Shell;
Table.Skeleton = Skeleton;
Table.Toolbar = Toolbar;
