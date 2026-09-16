import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/site-header.js";
import { SiteSidebar } from "@/components/site/site-sidebar.js";

export const Route = createFileRoute("/(site)")({
  component: SiteLayout
});

const drawerId = "site-drawer";

function SiteLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex min-h-screen flex-col">
        <SiteHeader drawerId={drawerId} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor={drawerId}
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <SiteSidebar />
      </div>
    </div>
  );
}
