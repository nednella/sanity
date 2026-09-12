import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { config } from "../config.js";
import { routes } from "./routes.js";

const { logLevel } = config;

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: logLevel,
      transport: { target: "pino-pretty" }
    }
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(routes);

  return app;
};
