import { Outlet, createFileRoute } from "@tanstack/react-router";

import { WikiTabStrip } from "@/components/wiki/wiki-tab-strip.js";

export const Route = createFileRoute("/(site)/wiki")({
  component: WikiLayout
});

function WikiLayout() {
  return (
    <div className="w-full">
      <WikiTabStrip />
      <Outlet />
    </div>
  );
}
