import type { RateLimitOptions } from "@fastify/rate-limit";
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

type RouteConfig = {
  access: RouteAccess;
  rateLimit?: RateLimitOptions;
};

// Require route access to be declared in each routes' config object!
type RouteDefinition<Schema extends FastifySchema> = Omit<ZodRouteOptions<Schema>, "config" | "onRequest"> & {
  config: RouteConfig;
};

export type Route = (app: ZodApp) => void;

// Apply the default rate limiting to all routes declared with public access!
function limitRoute(app: ZodApp, { access, rateLimit }: RouteConfig) {
  if (access !== "public") return [];
  return [app.rateLimit(rateLimit)];
}

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
      config: { access: route.config.access },
      onRequest: [...limitRoute(app, route.config), ...guardRoute(route.config.access)]
    });
  };
}
