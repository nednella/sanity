import { config } from "@config";

import { buildApp } from "./app";

const { host, port } = config;

const app = buildApp();
await app.listen({ host, port });
