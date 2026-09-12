import Fastify from "fastify";

import { config } from "../config.js";
import { routes } from "./routes.js";

const { logLevel } = config;

export const buildApp = () => {
  const app = Fastify({ logger: { level: logLevel } });
  app.register(routes);
  return app;
};
