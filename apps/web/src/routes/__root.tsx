import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { LoginDialog } from "@/components/login-dialog";
import { NotFound } from "@/components/not-found";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Layout,
  notFoundComponent: () => <NotFound fullScreen />
});

function Layout() {
  return (
    <>
      <div className="isolate">
        <Outlet />
      </div>
      <LoginDialog />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
