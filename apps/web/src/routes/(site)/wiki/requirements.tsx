import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/requirements")({
  component: RequirementsPage
});

function RequirementsPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Requirements placeholder</div>;
}
