import { Outlet, createFileRoute, linkOptions } from "@tanstack/react-router";

import { DashboardSidebar, DashboardTabs } from "@/components/layout/dashboard-navigation";
import { useSiteLayout } from "@/lib/layout/use-site-layout";

const adminLinks = linkOptions([
  {
    to: "/admin/review",
    title: "Review queue"
  },
  {
    to: "/admin/members",
    title: "Members"
  },
  {
    to: "/admin/points",
    title: "Points"
  }
]);

export const Route = createFileRoute("/(site)/admin")({
  component: Layout
});

function Layout() {
  useSiteLayout({
    hiddenSidebar: true,
    secondarySidebar: AdminSidebar
  });

  return (
    <div className="flex flex-col gap-4">
      <DashboardTabs links={adminLinks} />
      <Outlet />
    </div>
  );
}

function AdminSidebar() {
  return (
    <DashboardSidebar
      links={adminLinks}
      subtitle="Clan management"
      title="Admin"
    />
  );
}
