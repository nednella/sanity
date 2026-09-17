import { bindClient } from "./client.js";
import { healthRoutes } from "./modules/health/routes.js";
import { memberRoutes } from "./modules/members/routes.js";
import { personalBestRoutes } from "./modules/personal-bests/routes.js";
import { rankRoutes } from "./modules/ranks/routes.js";
import { submissionRoutes } from "./modules/submissions/routes.js";

export { toPage } from "./common.js";
export type { Route } from "./route.js";

export const contract = {
  routes: {
    health: healthRoutes,
    members: memberRoutes,
    personalBests: personalBestRoutes,
    ranks: rankRoutes,
    submissions: submissionRoutes
  }
};

export const createClient = (apiUrl: string) => bindClient(apiUrl, contract.routes);
