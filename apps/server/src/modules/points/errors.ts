import { ApplicationError } from "@/errors/error";

export const pointErrors = {
  bossNotFound: (name: string) => new ApplicationError("BOSS_NOT_FOUND", 404, `No boss is named ${name}.`),
  notMembers: (discordIds: bigint[]) =>
    new ApplicationError("NOT_MEMBERS", 404, `Discord IDs ${discordIds.join(", ")} are not members.`)
};
