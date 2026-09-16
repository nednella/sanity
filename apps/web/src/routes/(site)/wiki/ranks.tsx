import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/ranks")({
  component: RanksPage
});

function RanksPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Ranks placeholder</div>;
}
