import { writeFile } from "node:fs/promises";

import { buildApp } from "./app";

const app = buildApp();
await app.ready();
await writeFile(new URL("../openapi.json", import.meta.url), JSON.stringify(app.swagger(), null, 2));
await app.close();
