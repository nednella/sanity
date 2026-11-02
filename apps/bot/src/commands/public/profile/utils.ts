import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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

const SEPARATOR = " - ";

const linkButton = (label: string, url: string) =>
  new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(url);

const itemLink = ({ discordMessageUrl, item }: Submission) => {
  const name = escapeMarkdown(item.name ?? "Unknown item");
  return discordMessageUrl ? hyperlink(name, discordMessageUrl) : name;
};

const pointsFor = (memberId: string, { participants }: Submission) =>
  participants.find((participant) => participant.id === memberId)?.points ?? 0;

const describePoints = (memberId: string, drop: Submission) =>
  `${inlineCode(formatNumber(pointsFor(memberId, drop)))} pts`;

export const profileLinks = ({ id, wom }: MemberProfile) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    linkButton("Website", `${config.webUrl}/members/${id}`),
    ...(wom ? [linkButton("Wise Old Man", `${WOM_PLAYERS_URL}/${encodeURIComponent(wom.username)}`)] : [])
  );

export const diaryLinks = () =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(linkButton("Diary", `${config.webUrl}/wiki/diary`));

export const describeLatestDrop = (memberId: string, drop: Submission) => {
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
};

export const describeEarlierDrops = (memberId: string, drops: Submission[]) =>
  drops
    .map((drop) =>
      [
        itemLink(drop),
        describePoints(memberId, drop),
        time(new Date(drop.submittedAt), TimestampStyles.RelativeTime)
      ].join(SEPARATOR)
    )
    .join("\n");

export const describeClanAge = ({ displayName, membership }: MemberProfile) => {
  if (!membership.joinedAt) return `${bold(displayName)} has no join date.`;

  const joinedAt = new Date(membership.joinedAt);
  return `${bold(displayName)} joined on ${time(joinedAt, TimestampStyles.LongDate)}, ${timeSince(joinedAt, new Date())} ago.`;
};
