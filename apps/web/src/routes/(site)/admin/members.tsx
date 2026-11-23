import { createFileRoute } from "@tanstack/react-router";

import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/admin/members")({
  component: Page
});

function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Members</h1>
      <Muted className="mt-1">Change ranks, roles and membership for one or more members at a time.</Muted>
    </div>
  );
}
