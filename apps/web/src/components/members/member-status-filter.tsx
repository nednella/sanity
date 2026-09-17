import { Users } from "lucide-react";

import type { MemberStatus } from "@/lib/api/query/members.js";

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
    <details className="dropdown">
      <summary className="btn btn-sm">
        <Users className="size-4" />
        {labels[status]}
      </summary>
      <ul className="menu dropdown-content z-50 w-56 rounded-xs border border-base-300 bg-base-100 p-2 shadow-sm">
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
      </ul>
    </details>
  );
}
