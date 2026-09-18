import type { ReactTable, RowData } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features";
import { Dropdown } from "@/lib/ui/dropdown";

type DataTableColumnToggleProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableColumnToggle<TData extends RowData>({ table }: Readonly<DataTableColumnToggleProps<TData>>) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());

  return (
    <Dropdown
      align="end"
      label={
        <>
          <Columns3 className="size-4" />
          Columns
        </>
      }
    >
      {columns.map((column) => (
        <li key={column.id}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
          </label>
        </li>
      ))}
    </Dropdown>
  );
}
