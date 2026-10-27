import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import {
  createJsonSchemaTransform,
  createJsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";

import { config } from "@config";

import { handleError, handleNotFound } from "@/errors/handlers";
import { jsonSchemaOverride } from "@/schema/codecs";

import { routes } from "./routes";

const { corsOrigin, isProduction, logLevel, trustProxy } = config;

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: logLevel,
      transport: isProduction ? undefined : { target: "pino-pretty" }
    },
    trustProxy
  });

  app.register(cors, {
    origin: corsOrigin,
    methods: ["DELETE", "GET", "HEAD", "PATCH", "POST"]
  });

  // register a default rate limit of 60/min per IP address.
  // with global = false, it applies only to routes that ask for it (see: utils/define-route.ts)
  app.register(rateLimit, {
    global: false,
    max: 60,
    timeWindow: "1 minute"
  });

  app.register(swagger, {
    openapi: { info: { title: "Sanity API", version: "1.0.0" } },
    transform: createJsonSchemaTransform({ zodToJsonConfig: { override: jsonSchemaOverride } }),
    transformObject: createJsonSchemaTransformObject({ zodToJsonConfig: { override: jsonSchemaOverride } })
  });
  app.register(scalar, { routePrefix: "/docs" });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(handleError);
  app.setNotFoundHandler(handleNotFound);

  app.register(routes, { prefix: "/v1" });

  return app;
};
