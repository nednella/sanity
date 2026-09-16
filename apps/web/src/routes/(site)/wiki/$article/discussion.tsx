import { createFileRoute, notFound } from "@tanstack/react-router";

import { articleFromSlug } from "@/lib/navigation/article.js";

export const Route = createFileRoute("/(site)/wiki/$article/discussion")({
  component: DiscussionPage,
  beforeLoad: ({ params }) => {
    if (!articleFromSlug(params.article)) throw notFound();
  }
});

function DiscussionPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Discussion placeholder</div>;
}
