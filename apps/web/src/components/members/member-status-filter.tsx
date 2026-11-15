import { Users } from "lucide-react";

import type { MemberStatus } from "@/lib/members/status";
import { Dropdown } from "@/lib/ui/dropdown";

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
    <Dropdown
      label={
        <>
          <Users className="size-4" />
          {labels[status]}
        </>
      }
    >
      <li>
        <label className="flex items-center gap-2">
          <input
            checked={isActive}
            className="checkbox checkbox-sm"
            onChange={(event) => onChange(toStatus(event.target.checked, isInactive))}
            type="checkbox"
          />
          Active
        </label>
      </li>
      <li>
        <label className="flex items-center gap-2">
          <input
            checked={isInactive}
            className="checkbox checkbox-sm"
            onChange={(event) => onChange(toStatus(isActive, event.target.checked))}
            type="checkbox"
          />
          Inactive
        </label>
      </li>
    </Dropdown>
  );
}

function toStatus(isActive: boolean, isInactive: boolean): MemberStatus {
  if (isActive && isInactive) return "all";
  if (isInactive) return "inactive";
  return "active";
}
