import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import type { Route } from "./define-route";

export function defineModule(routes: Route[]): FastifyPluginAsyncZod {
  return async function register(app) {
    for (const route of routes) route(app);
  };
}
