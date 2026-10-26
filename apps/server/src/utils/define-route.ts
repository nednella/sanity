import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions
} from "fastify";
import type { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod";

import { authenticate } from "@/modules/auth/hooks/authenticate";
import { type RouteAccess, authorise } from "@/modules/auth/hooks/authorise";

type ZodApp = Parameters<FastifyPluginAsyncZod>[0];

type ZodRouteOptions<Schema extends FastifySchema> = RouteOptions<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
  ContextConfigDefault,
  Schema,
  ZodTypeProvider,
  FastifyBaseLogger
>;

// Require route access to be declared in each routes' config object!
type RouteDefinition<Schema extends FastifySchema> = Omit<ZodRouteOptions<Schema>, "config" | "onRequest"> & {
  config: { access: RouteAccess };
};

export type Route = (app: ZodApp) => void;

// Based on the route access declared per-route, we attach hooks on request.
// If access is "public", we leave it open, else we attach authenticate and
// authorise hooks.
function guardRoute(access: RouteAccess) {
  if (access === "public") return [];

  return [authenticate, authorise];
}

export function defineRoute<const Schema extends FastifySchema>(route: RouteDefinition<Schema>): Route {
  return function register(app) {
    app.route({
      ...route,
      onRequest: guardRoute(route.config.access)
    });
  };
}
