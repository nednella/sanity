import type { ReviewStatus } from "@/lib/api/types";
import { Badge } from "@/lib/ui/badge";

const labels: Record<ReviewStatus, string> = {
  approved: "Approved",
  approved_missing_member: "Missing member",
  denied: "Denied",
  deleted_by_user: "Deleted",
  pending: "Pending",
  submitted: "Submitted"
};

const variants: Record<ReviewStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  approved: "success",
  approved_missing_member: "outline",
  denied: "error",
  deleted_by_user: "outline",
  pending: "warning",
  submitted: "warning"
};

type ReviewStatusBadgeProps = {
  status: ReviewStatus;
};

export function ReviewStatusBadge({ status }: Readonly<ReviewStatusBadgeProps>) {
  return (
    <Badge
      size="sm"
      variant={variants[status]}
    >
      {labels[status]}
    </Badge>
  );
}
