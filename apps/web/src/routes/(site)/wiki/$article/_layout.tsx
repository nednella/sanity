import { Outlet, createFileRoute } from "@tanstack/react-router";

import { WikiTabStrip } from "@/components/wiki/wiki-tab-strip.js";

export const Route = createFileRoute("/(site)/wiki/$article")({
  component: WikiArticleLayout
});

function WikiArticleLayout() {
  const { article } = Route.useParams();

  return (
    <div className="w-full">
      <WikiTabStrip article={article} />
      <Outlet />
    </div>
  );
}
