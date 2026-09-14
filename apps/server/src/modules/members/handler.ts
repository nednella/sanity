import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { contract } from "@sanity/api";

import { getMemberPersonalBests } from "../personal-bests/service.js";
import { getMemberProfile, getMembers } from "./service.js";

export const memberRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    ...contract.routes.members.list,
    handler: async (req) => getMembers(req.query)
  });

  app.route({
    ...contract.routes.members.get,
    handler: async (req, res) => {
      const profile = await getMemberProfile(req.params.id);
      return profile ?? res.code(404).send({ message: "member not found" });
    }
  });

  app.route({
    ...contract.routes.members.listPersonalBests,
    handler: async (req) => getMemberPersonalBests(req.params.id, req.query)
  });
};
