import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/layout/site-layout";

export const Route = createFileRoute("/(site)")({
  component: Layout
});

function Layout() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
