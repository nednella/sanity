import { ArrowLeftRight } from "lucide-react";

import type { SubmissionType } from "@/lib/submissions/search";
import { Button } from "@/lib/ui/button";
import { Tooltip } from "@/lib/ui/tooltip";

const labels: Record<SubmissionType, string> = {
  drops: "Drops",
  personalBests: "Personal Bests"
};

type SubmissionTypeToggleProps = {
  onChange: (type: SubmissionType) => void;
  type: SubmissionType;
};

// Two tables, so the control is the switch between them rather than a list to
// pick from.
export function SubmissionTypeToggle({ onChange, type }: Readonly<SubmissionTypeToggleProps>) {
  const next = type === "drops" ? "personalBests" : "drops";

  return (
    <Tooltip tip={`Show ${labels[next].toLowerCase()}`}>
      <Button
        onClick={() => onChange(next)}
        size="sm"
        variant="outline"
      >
        <ArrowLeftRight className="size-4" />
        {labels[type]}
      </Button>
    </Tooltip>
  );
}
