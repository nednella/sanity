import type { ChatInputCommandInteraction } from "discord.js";

import { ApiError } from "@sanity/api";

import { api } from "@/lib/api";
import { successEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyError, replyNotAMember } from "@/utils/replies";

// The birthdays carried over from sanityv2 store an unknown year as 1900.
const UNKNOWN_YEAR = 1900;

const pad = (value: number) => String(value).padStart(2, "0");

const describe = (birthday: string, year: number) =>
  new Date(birthday).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: year === UNKNOWN_YEAR ? undefined : "numeric",
    timeZone: "UTC"
  });

export const handleBirthdayAdd = async (interaction: ChatInputCommandInteraction) => {
  const day = interaction.options.getInteger("day", true);
  const month = interaction.options.getInteger("month", true);
  const year = interaction.options.getInteger("year") ?? UNKNOWN_YEAR;
  const birthday = `${year}-${pad(month)}-${pad(day)}`;

  const member = await findMember(interaction.user);
  if (!member) return replyNotAMember(interaction, interaction.user);

  try {
    await api.patch("/v1/members/{id}", {
      params: { path: { id: member.id } },
      body: {
        actingDiscordId: interaction.user.id,
        birthday
      }
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) return replyError(interaction, "That date does not exist.");
    throw error;
  }

  return reply(interaction, successEmbed({ description: `Your birthday is set to ${describe(birthday, year)}.` }));
};
