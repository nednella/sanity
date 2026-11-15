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

import type { MemberRole } from "@db/enums";

import { type ActingAuth, type Auth, authenticate } from "@/modules/auth/hooks/authenticate";
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

type ZodHandler<Schema extends FastifySchema> = ZodRouteOptions<Schema>["handler"];

type RouteConfig<Access extends RouteAccess = RouteAccess> = {
  access: Access;
  rateLimit?: RateLimitOptions;
};

// A public route has no auth, a route with a role always has a member, and a
// route with no role may have one.
type RequestAuth<Access extends RouteAccess> = Access extends "public"
  ? unknown
  : { auth: Access extends { role: "*" | MemberRole } ? ActingAuth : Auth };

type RouteHandler<Schema extends FastifySchema, Access extends RouteAccess> = (
  request: Omit<Parameters<ZodHandler<Schema>>[0], "auth"> & RequestAuth<Access>,
  reply: Parameters<ZodHandler<Schema>>[1]
) => ReturnType<ZodHandler<Schema>>;

// Require route access to be declared in each routes' config object!
type RouteDefinition<Schema extends FastifySchema, Access extends RouteAccess> = Omit<
  ZodRouteOptions<Schema>,
  "config" | "handler" | "onRequest"
> & {
  config: RouteConfig<Access>;
  handler: RouteHandler<Schema, Access>;
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

export function defineRoute<const Schema extends FastifySchema, Access extends RouteAccess>(
  route: RouteDefinition<Schema, Access>
): Route {
  return function register(app) {
    app.route({
      ...route,
      // guardRoute's hooks give request.auth the shape RequestAuth promises
      handler: route.handler as unknown as ZodHandler<Schema>,
      config: { access: route.config.access },
      onRequest: [...limitRoute(app, route.config), ...guardRoute(route.config.access)]
    });
  };
}
