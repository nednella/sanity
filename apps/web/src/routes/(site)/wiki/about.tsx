import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/about")({
  component: AboutPage
});

function AboutPage() {
  return <div className="grid h-full place-items-center text-base-content/60">About placeholder</div>;
}
