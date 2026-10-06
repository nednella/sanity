import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { config } from "@config";

import { SiteLayout } from "@/components/layout/site-layout";

// Nothing but the landing page is public until launch.
export const Route = createFileRoute("/(site)")({
  beforeLoad: () => {
    if (config.isProduction) throw redirect({ to: "/" });
  },
  component: Layout
});

function Layout() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
