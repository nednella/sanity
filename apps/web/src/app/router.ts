import { createRouter } from "@tanstack/react-router";

import { queryClient } from "@/lib/api/query-client";
import { routeTree } from "@/routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  notFoundMode: "root",
  scrollRestoration: true
});
