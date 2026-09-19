import { Users } from "lucide-react";

import type { MemberStatus } from "@/lib/members/status";
import { Dropdown } from "@/lib/ui/dropdown";

type MemberStatusFilterProps = {
  status: MemberStatus;
  onChange: (status: MemberStatus) => void;
};

const labels: Record<MemberStatus, string> = {
  active: "Active",
  all: "All",
  inactive: "Inactive"
};

const toStatus = (isActive: boolean, isInactive: boolean): MemberStatus => {
  if (isActive && isInactive) return "all";
  if (isInactive) return "inactive";
  return "active";
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
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={isActive}
            onChange={(event) => onChange(toStatus(event.target.checked, isInactive))}
          />
          Active
        </label>
      </li>
      <li>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={isInactive}
            onChange={(event) => onChange(toStatus(isActive, event.target.checked))}
          />
          Inactive
        </label>
      </li>
    </Dropdown>
  );
}
