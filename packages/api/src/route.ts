import type { z } from "zod";

export type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  schema: {
    params?: z.ZodType;
    querystring?: z.ZodObject;
    body?: z.ZodType;
    response: Record<number, z.ZodType>;
  };
};

export const route = <const R extends Route>(definition: R) => definition;
