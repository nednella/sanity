import { config } from "../config.js";
import { buildApp } from "./app.js";

const { host, port } = config;

const app = buildApp();
await app.listen({ host, port });
