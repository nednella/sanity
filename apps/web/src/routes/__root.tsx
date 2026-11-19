import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { NotFound } from "@/components/not-found";
import { SignInDialog } from "@/components/sign-in-dialog";
import { validateSignInSearch } from "@/lib/sign-in/search";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Layout,
  notFoundComponent: () => <NotFound fullScreen />,
  validateSearch: validateSignInSearch
});

function Layout() {
  return (
    <>
      <div className="isolate">
        <Outlet />
      </div>
      <SignInDialog />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
