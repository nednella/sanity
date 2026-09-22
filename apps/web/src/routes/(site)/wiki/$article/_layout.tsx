import { Outlet, createFileRoute } from "@tanstack/react-router";

import { WikiTabs } from "@/components/wiki/wiki-tabs";

export const Route = createFileRoute("/(site)/wiki/$article")({
  component: Layout
});

function Layout() {
  const { article } = Route.useParams();

  return (
    <div className="w-full">
      <WikiTabs article={article} />
      <Outlet />
    </div>
  );
}
