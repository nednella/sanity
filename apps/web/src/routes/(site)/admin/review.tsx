import { createFileRoute } from "@tanstack/react-router";

import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/admin/review")({
  component: Page
});

function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Review queue</h1>
      <Muted className="mt-1">Drop submissions waiting for a reviewer to approve or deny them.</Muted>
    </div>
  );
}
