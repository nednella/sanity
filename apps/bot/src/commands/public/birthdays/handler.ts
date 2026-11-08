import {
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  bold,
  escapeMarkdown,
  inlineCode
} from "discord.js";

import type { Birthday } from "@sanity/api";
import { relativeDate, toIsoDate } from "@sanity/utils";

import { api } from "@/lib/api";
import { OLDEST_AGE_SHOWN, formatDayMonth } from "@/utils/birthdays";
import { buildEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const DAY_MS = 24 * 60 * 60 * 1000;

const SEPARATOR = " · ";

const SUGGESTED_DAYS = [7, 30];

const formatDays = (days: number) => (days === 1 ? "1 day" : `${days} days`);

const formatCountdown = (date: string, from: string) => {
  const days = Math.round((Date.parse(date) - Date.parse(from)) / DAY_MS);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${formatDays(days)}`;
};

const describeBirthday = ({ member, date, age }: Birthday, from: string) => {
  const parts = [
    `${inlineCode(formatDayMonth(date))} ${bold(escapeMarkdown(member.displayName))}`,
    formatCountdown(date, from)
  ];
  if (age > 0 && age <= OLDEST_AGE_SHOWN) parts.push(`turns ${age}`);
  return parts.join(SEPARATOR);
};

export const MAX_DAYS = 366;

export const handleBirthdays = async (interaction: ChatInputCommandInteraction) => {
  const days = interaction.options.getInteger("days", true);
  const today = new Date();
  const from = toIsoDate(today);

  const birthdays = await api.get("/v1/members/birthdays", {
    params: {
      query: {
        from,
        to: toIsoDate(relativeDate({ days: days - 1 }, today))
      }
    }
  });

  const title = `Birthdays in the next ${formatDays(days)}`;

  const description =
    birthdays.length === 0
      ? "Nobody has a birthday in this period."
      : birthdays.map((birthday) => describeBirthday(birthday, from)).join("\n");

  return reply(interaction, buildEmbed({ title, description }));
};

export const suggestDays = (interaction: AutocompleteInteraction) => {
  const typed = Number(interaction.options.getFocused());
  const isValid = Number.isSafeInteger(typed) && typed >= 1 && typed <= MAX_DAYS;
  const days = isValid ? [typed] : SUGGESTED_DAYS;

  return interaction.respond(days.map((value) => ({ name: `Next ${formatDays(value)}`, value })));
};
