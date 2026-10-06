import cors from "@fastify/cors";
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

import { jsonSchemaOverride } from "@/schema/codecs";

import { routes } from "./routes";

const { corsOrigin, isProduction, logLevel } = config;

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: logLevel,
      transport: isProduction ? undefined : { target: "pino-pretty" }
    }
  });

  app.register(cors, { origin: corsOrigin });

  app.register(swagger, {
    openapi: { info: { title: "Sanity API", version: "1.0.0" } },
    transform: createJsonSchemaTransform({ zodToJsonConfig: { override: jsonSchemaOverride } }),
    transformObject: createJsonSchemaTransformObject({ zodToJsonConfig: { override: jsonSchemaOverride } })
  });
  app.register(scalar, { routePrefix: "/docs" });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(routes, { prefix: "/v1" });

  return app;
};
