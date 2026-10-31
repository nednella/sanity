import { z } from "zod";

import { rankedPersonalBest } from "@/modules/personal-bests/response";
import { getPersonalBests } from "@/modules/personal-bests/service/get-personal-bests";
import { memberDiary } from "@/modules/speedrun-diary/response";
import { getMemberDiary } from "@/modules/speedrun-diary/service/get-member-diary";
import { submission } from "@/modules/submissions/response";
import { getSubmissions } from "@/modules/submissions/service/get-submissions";
import { errorResponse, paginated, toPage } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import {
  changePluginAccessBody,
  changeRankBody,
  changeRoleBody,
  memberCommandBody,
  memberListQuery,
  memberParams,
  memberPersonalBestsQuery,
  memberSubmissionsQuery,
  trialBody,
  updateMemberBody
} from "./request";
import { member, memberChanges, memberProfile, rankProposals, trialOutcomes } from "./response";
import { changeMemberRanks } from "./service/change-member-ranks";
import { changeMemberRoles } from "./service/change-member-roles";
import { changePluginAccess } from "./service/change-plugin-access";
import { delayDemotions } from "./service/delay-demotions";
import { editMemberProfile } from "./service/edit-member-profile";
import { getMemberProfile } from "./service/get-member-profile";
import { getMembers } from "./service/get-members";
import { passMembers } from "./service/pass-members";
import { proposeRankChanges } from "./service/propose-rank-changes";
import { quitMembers } from "./service/quit-members";
import { retireMembers } from "./service/retire-members";
import { trialMembers } from "./service/trial-members";
import { unretireMembers } from "./service/unretire-members";

export const membersModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/members",
    config: {
      access: "public"
    },
    schema: {
      querystring: memberListQuery,
      response: {
        200: paginated(member)
      }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getMembers(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  }),

  defineRoute({
    method: "GET",
    url: "/members/:id",
    config: {
      access: "public"
    },
    schema: {
      params: memberParams,
      response: {
        200: memberProfile,
        404: errorResponse
      }
    },
    handler: async (req) => getMemberProfile(req.params.id)
  }),

  defineRoute({
    method: "GET",
    url: "/members/:id/diary",
    config: {
      access: "public"
    },
    schema: {
      params: memberParams,
      response: {
        200: z.array(memberDiary)
      }
    },
    handler: async (req) => getMemberDiary(req.params.id)
  }),

  defineRoute({
    method: "GET",
    url: "/members/:id/personal-bests",
    config: {
      access: "public"
    },
    schema: {
      params: memberParams,
      querystring: memberPersonalBestsQuery,
      response: {
        200: paginated(rankedPersonalBest)
      }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getPersonalBests({ ...req.query, memberId: req.params.id });
      return { items, page: toPage({ limit, offset, total }) };
    }
  }),

  defineRoute({
    method: "GET",
    url: "/members/:id/submissions",
    config: {
      access: "public"
    },
    schema: {
      params: memberParams,
      querystring: memberSubmissionsQuery,
      response: {
        200: paginated(submission)
      }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getSubmissions({ ...req.query, memberId: req.params.id });
      return { items, page: toPage({ limit, offset, total }) };
    }
  }),

  defineRoute({
    method: "GET",
    url: "/members/me",
    config: {
      access: {
        role: "*",
        clients: ["bot", "plugin"]
      }
    },
    schema: {
      response: {
        200: memberProfile,
        404: errorResponse
      }
    },
    handler: async (req) => getMemberProfile(req.auth.member.id)
  }),

  defineRoute({
    method: "PATCH",
    url: "/members/me",
    config: {
      access: {
        role: "*",
        clients: ["bot"]
      }
    },
    schema: {
      body: updateMemberBody,
      response: {
        204: z.void(),
        404: errorResponse
      }
    },
    handler: async (req, reply) => {
      await editMemberProfile(req.auth, req.body);
      return reply.code(204).send();
    }
  }),

  defineRoute({
    method: "POST",
    url: "/members/propose-rank-changes",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        200: rankProposals
      }
    },
    handler: () => proposeRankChanges()
  }),

  defineRoute({
    method: "POST",
    url: "/members/delay-demotion",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: memberCommandBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => delayDemotions(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/pass-trial",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: memberCommandBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => passMembers(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/plugin-access",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: changePluginAccessBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => changePluginAccess(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/quit",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: memberCommandBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => quitMembers(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/rank",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: changeRankBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => changeMemberRanks(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/retire",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: memberCommandBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => retireMembers(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/role",
    config: {
      access: {
        role: "superuser",
        clients: ["bot"]
      }
    },
    schema: {
      body: changeRoleBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => changeMemberRoles(req.body, req.auth)
  }),

  defineRoute({
    method: "POST",
    url: "/members/trial",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: trialBody,
      response: {
        200: trialOutcomes
      }
    },
    handler: async (req) => ({ results: await trialMembers(req.body, req.auth) })
  }),

  defineRoute({
    method: "POST",
    url: "/members/unretire",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: memberCommandBody,
      response: {
        200: memberChanges
      }
    },
    handler: async (req) => unretireMembers(req.body, req.auth)
  })
]);
