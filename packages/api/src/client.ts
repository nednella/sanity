import { z } from "zod";

import type { Route } from "./route.js";

type Schema = Route["schema"];

type Field<S extends Schema, K extends "params" | "body"> = S[K] extends z.ZodType
  ? { [P in K]: z.output<S[K]> }
  : unknown;

// Every query field is optional when sending, because the server fills in its defaults.
type Query<S extends Schema> = S["querystring"] extends z.ZodObject
  ? { querystring?: Partial<z.output<S["querystring"]>> }
  : unknown;

type Input<S extends Schema> = Field<S, "params"> & Query<S> & Field<S, "body">;

type Result<S extends Schema> = {
  [Status in keyof S["response"]]: {
    status: Status;
    body: z.output<S["response"][Status]>;
  };
}[keyof S["response"]];

type Call<R extends Route> = (
  ...input: object extends Input<R["schema"]> ? [input?: Input<R["schema"]>] : [input: Input<R["schema"]>]
) => Promise<Result<R["schema"]>>;

type Client<Routes> = {
  [K in keyof Routes]: Routes[K] extends Route ? Call<Routes[K]> : Client<Routes[K]>;
};

type Payload = {
  params?: Record<string, unknown>;
  querystring?: object;
  body?: unknown;
};

const isRoute = (value: object): value is Route => "method" in value;

const toPath = ({ url, schema }: Route, params: unknown) => {
  const encoded = schema.params ? (z.encode(schema.params, params) as Record<string, unknown>) : {};
  return url.replaceAll(/:(\w+)/g, (_, key: string) => encodeURIComponent(String(encoded[key])));
};

const request = async (origin: URL, route: Route, payload: Payload = {}) => {
  const { method, schema } = route;
  const target = new URL(`${origin.pathname.replace(/\/$/, "")}${toPath(route, payload.params)}`, origin);

  if (schema.querystring) {
    const query = z.encode(schema.querystring.partial(), payload.querystring ?? {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) target.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(target, {
    method,
    headers: schema.body ? { "content-type": "application/json" } : undefined,
    body: schema.body ? JSON.stringify(z.encode(schema.body, payload.body)) : undefined
  });

  const responseSchema = schema.response[response.status];
  if (!responseSchema) throw new Error(`${method} ${target.pathname} responded ${response.status}`);

  return {
    status: response.status,
    body: responseSchema.parse(await response.json())
  };
};

const bind = (origin: URL, routes: object): object =>
  Object.fromEntries(
    Object.entries(routes).map(([key, value]) => [
      key,
      isRoute(value) ? (payload?: Payload) => request(origin, value, payload) : bind(origin, value)
    ])
  );

export const bindClient = <Routes extends object>(baseUrl: string, routes: Routes) =>
  bind(new URL(baseUrl), routes) as Client<Routes>;
