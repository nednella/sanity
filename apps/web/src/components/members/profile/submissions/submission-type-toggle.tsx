import { ArrowLeftRight } from "lucide-react";

import type { SubmissionType } from "@/lib/members/submissions";
import { Button } from "@/lib/ui/button";
import { Tooltip } from "@/lib/ui/tooltip";

type SubmissionTypeToggleProps = {
  onChange: (type: SubmissionType) => void;
  type: SubmissionType;
};

const labels: Record<SubmissionType, string> = {
  drops: "Drops",
  personalBests: "Personal Bests"
};

// Two tables, so the control is the switch between them rather than a list to pick from.
export function SubmissionTypeToggle({ onChange, type }: Readonly<SubmissionTypeToggleProps>) {
  const next = type === "drops" ? "personalBests" : "drops";

  return (
    <Tooltip tip={`Show ${labels[next].toLowerCase()}`}>
      <Button
        size="sm"
        variant="custom"
        onClick={() => onChange(next)}
      >
        <ArrowLeftRight className="size-4" />
        {labels[type]}
      </Button>
    </Tooltip>
  );
}
