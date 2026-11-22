import { Users } from "lucide-react";

import type { MemberStatus } from "@/lib/members/status";
import { Button } from "@/lib/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/lib/ui/dropdown-menu";

const labels: Record<MemberStatus, string> = {
  active: "Active",
  all: "All",
  inactive: "Inactive"
};

type MemberStatusFilterProps = {
  onChange: (status: MemberStatus) => void;
  status: MemberStatus;
};

export function MemberStatusFilter({ status, onChange }: Readonly<MemberStatusFilterProps>) {
  const isActive = status !== "inactive";
  const isInactive = status !== "active";

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
        <Users />
        {labels[status]}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={isActive}
          onCheckedChange={(checked) => onChange(toStatus(checked, isInactive))}
        >
          Active
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isInactive}
          onCheckedChange={(checked) => onChange(toStatus(isActive, checked))}
        >
          Inactive
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function toStatus(isActive: boolean, isInactive: boolean): MemberStatus {
  if (isActive && isInactive) return "all";
  if (isInactive) return "inactive";
  return "active";
}
