import { createFileRoute } from "@tanstack/react-router";

import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/admin/points")({
  component: Page
});

function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Points</h1>
      <Muted className="mt-1">Award or deduct points that nothing else in the clan explains.</Muted>
    </div>
  );
}
