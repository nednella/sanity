import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/faq")({
  component: FaqPage
});

function FaqPage() {
  return <div className="grid h-full place-items-center text-base-content/60">FAQ placeholder</div>;
}
