import type { ReactTable, RowData } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

import type { DataTableFeatures } from "@/components/table/table-features";
import { Button } from "@/lib/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/lib/ui/dropdown-menu";

type DataTableColumnToggleProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
};

export function DataTableColumnToggle<TData extends RowData>({ table }: Readonly<DataTableColumnToggleProps<TData>>) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="sm"
            variant="outline"
          />
        }
      >
        <Columns3 />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={column.getIsVisible()}
            key={column.id}
            onCheckedChange={(checked) => column.toggleVisibility(checked)}
          >
            {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
