import { type ChatInputCommandInteraction, TimestampStyles, codeBlock, time } from "discord.js";

import type { ApiKey } from "@sanity/api";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed, fitLines } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const DESCRIPTION_LIMIT = 4096;

function describeKey({ client, createdAt, id, lastUsedAt, memberId }: ApiKey) {
  const lastUsed = lastUsedAt ? time(new Date(lastUsedAt), TimestampStyles.RelativeTime) : "never";
  return [
    `#${id}`,
    client,
    memberId ? `member ${memberId}` : null,
    `created ${time(new Date(createdAt), TimestampStyles.ShortDate)}`,
    `used ${lastUsed}`
  ]
    .filter(Boolean)
    .join(" · ");
}

async function create(interaction: ChatInputCommandInteraction) {
  const { id, key } = await api.post("/v1/auth/bot-key");

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: `Bot key #${id}`,
      description: `${codeBlock(key)}\nThis is the only time it is shown. Keep it secret.`
    })
  );
}

async function list(interaction: ChatInputCommandInteraction) {
  const keys = await api.get("/v1/auth/keys");
  const live = keys.filter((key) => key.revokedAt === null);
  const lines = live.map((key) => describeKey(key));

  await reply(
    interaction,
    buildEmbed({
      title: `API keys (${live.length} live, ${keys.length - live.length} revoked)`,
      description: lines.length === 0 ? "No key is live." : fitLines(lines, DESCRIPTION_LIMIT)
    })
  );
}

async function revoke(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getInteger("id", true);
  await api.delete("/v1/auth/keys/{id}", { params: { path: { id } } });

  await reply(
    interaction,
    buildEmbed({ style: "success", title: "Key revoked", description: `Key #${id} no longer works.` })
  );
}

const SUBCOMMANDS = {
  create,
  list,
  revoke
};

export function handleApiKey(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}
