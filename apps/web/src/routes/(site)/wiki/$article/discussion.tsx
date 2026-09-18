import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/$article/discussion")({
  component: DiscussionPage
});

function DiscussionPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Discussion placeholder</div>;
}
