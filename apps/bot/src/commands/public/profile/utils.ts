import {
  ActionRowBuilder,
  type ButtonBuilder,
  TimestampStyles,
  bold,
  escapeMarkdown,
  hyperlink,
  inlineCode,
  time
} from "discord.js";

import type { MemberProfile, Submission } from "@sanity/api";
import { WOM_PLAYERS_URL } from "@sanity/urls";
import { formatNumber, timeSince } from "@sanity/utils";

import { config } from "@config";

import { linkButton } from "@/utils/buttons";

const SEPARATOR = " - ";

export function profileLinks({ id, wom }: MemberProfile) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    linkButton("Website", `${config.webUrl}/members/${id}`),
    ...(wom ? [linkButton("Wise Old Man", `${WOM_PLAYERS_URL}/${encodeURIComponent(wom.username)}`)] : [])
  );
}

export function diaryLinks() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(linkButton("Diary", `${config.webUrl}/wiki/diary`));
}

export function describeLatestDrop(memberId: string, drop: Submission) {
  const details = [
    drop.valueMillions !== null && `${bold(formatNumber(drop.valueMillions * 1_000_000, 0, "compact"))} value`,
    `${bold(formatNumber(pointsFor(memberId, drop)))} pts`,
    drop.participants.length === 1 ? "solo" : `team of ${drop.participants.length}`,
    time(new Date(drop.submittedAt), TimestampStyles.LongDate)
  ]
    .filter(Boolean)
    .join(SEPARATOR);
  const teammates = drop.participants
    .filter((participant) => participant.id !== memberId)
    .map((participant) => escapeMarkdown(participant.displayName));

  const lines = [bold(itemLink(drop)), details];
  if (teammates.length > 0) {
    lines.push(`-# with ${new Intl.ListFormat("en-GB").format(teammates)}`);
  }

  const quote = lines.map((line) => `> ${line}`).join("\n");
  return `### Latest\n${quote}`;
}

export function describeEarlierDrops(memberId: string, drops: Submission[]) {
  return drops
    .map((drop) =>
      [
        itemLink(drop),
        describePoints(memberId, drop),
        time(new Date(drop.submittedAt), TimestampStyles.RelativeTime)
      ].join(SEPARATOR)
    )
    .join("\n");
}

export function describeClanAge({ displayName, membership }: MemberProfile) {
  if (!membership.joinedAt) return `${bold(displayName)} has no join date.`;

  const joinedAt = new Date(membership.joinedAt);
  return `${bold(displayName)} joined on ${time(joinedAt, TimestampStyles.LongDate)}, ${timeSince(joinedAt, new Date())} ago.`;
}

function itemLink({ discordMessageUrl, item }: Submission) {
  const name = escapeMarkdown(item.name ?? "Unknown item");
  return discordMessageUrl ? hyperlink(name, discordMessageUrl) : name;
}

function pointsFor(memberId: string, { participants }: Submission) {
  return participants.find((participant) => participant.id === memberId)?.points ?? 0;
}

function describePoints(memberId: string, drop: Submission) {
  return `${inlineCode(formatNumber(pointsFor(memberId, drop)))} pts`;
}
