import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import Fastify from "fastify";
import { createJsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { jsonSchemaOverride } from "@sanity/api";

import { config } from "../config.js";
import { routes } from "./routes.js";

const { logLevel, corsOrigin } = config;

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: logLevel,
      transport: { target: "pino-pretty" }
    }
  });

  app.register(cors, { origin: corsOrigin });

  app.register(swagger, {
    openapi: { info: { title: "Sanity API", version: "1.0.0" } },
    transform: createJsonSchemaTransform({ zodToJsonConfig: { override: jsonSchemaOverride } })
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(routes, { prefix: "/v1" });

  return app;
};
