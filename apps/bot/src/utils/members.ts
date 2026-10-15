import type { User } from "discord.js";

import { ApiError } from "@sanity/api";

import { api } from "@/lib/api";

export const findMember = async (user: User) => {
  try {
    return await api.get("/v1/members/discord/{discordId}", { params: { path: { discordId: user.id } } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
};
