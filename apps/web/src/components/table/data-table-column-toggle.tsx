import type { ReactTable, RowData } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features.js";

type DataTableColumnToggleProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableColumnToggle<TData extends RowData>({ table }: Readonly<DataTableColumnToggleProps<TData>>) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-sm">
        <Columns3 className="size-4" />
        Columns
      </summary>
      <ul className="menu dropdown-content z-50 w-56 rounded-xs border border-base-300 bg-base-100 p-2 shadow-sm">
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
      </ul>
    </details>
  );
}
