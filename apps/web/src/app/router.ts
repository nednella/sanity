import { createRouter } from "@tanstack/react-router";

import { queryClient } from "@/lib/api/query-client";
import type { LoginState } from "@/lib/login/use-login-dialog";
import { routeTree } from "@/routeTree.gen";

declare module "@tanstack/react-router" {
  interface HistoryState {
    login?: LoginState;
  }

  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  notFoundMode: "root",
  scrollRestoration: true
});
