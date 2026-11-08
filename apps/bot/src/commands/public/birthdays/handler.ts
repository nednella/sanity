import { type AutocompleteInteraction, type ChatInputCommandInteraction, bold, escapeMarkdown } from "discord.js";

import type { Birthday } from "@sanity/api";
import { formatDate, relativeDate, toIsoDate } from "@sanity/utils";

import { api } from "@/lib/api";
import { buildEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const OLDEST_AGE_SHOWN = 99;

const SUGGESTED_DAYS = [7, 30];

const SEPARATOR = " - ";

const formatDays = (days: number) => (days === 1 ? "1 day" : `${days} days`);

const describeBirthday = ({ member, date, age }: Birthday) => {
  const parts = [bold(escapeMarkdown(member.displayName)), formatDate(date)];
  if (age > 0 && age <= OLDEST_AGE_SHOWN) parts.push(`turns ${age}`);
  return parts.join(SEPARATOR);
};

export const MAX_DAYS = 366;

export const handleBirthdays = async (interaction: ChatInputCommandInteraction) => {
  const days = interaction.options.getInteger("days", true);
  const today = new Date();

  const birthdays = await api.get("/v1/members/birthdays", {
    params: {
      query: {
        from: toIsoDate(today),
        to: toIsoDate(relativeDate({ days: days - 1 }, today))
      }
    }
  });

  const title = `Birthdays in the next ${formatDays(days)}`;
  const description =
    birthdays.length === 0
      ? "Nobody has a birthday in this period."
      : birthdays.map((birthday) => describeBirthday(birthday)).join("\n");

  return reply(interaction, buildEmbed({ title, description }));
};

export const suggestDays = (interaction: AutocompleteInteraction) => {
  const typed = Number(interaction.options.getFocused());
  const isValid = Number.isSafeInteger(typed) && typed >= 1 && typed <= MAX_DAYS;
  const days = isValid ? [typed] : SUGGESTED_DAYS;

  return interaction.respond(days.map((value) => ({ name: `Next ${formatDays(value)}`, value })));
};
