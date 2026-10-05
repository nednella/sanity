import type { ChatInputCommandInteraction } from "discord.js";

import { ApiError, type Health, NetworkError } from "@sanity/api";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { capitalise, formatMs } from "@/utils/format";
import { reply } from "@/utils/replies";

type Check = Omit<Health["checks"][number], "latencyMs"> & { latencyMs?: number };

export const handleMainframe = async (interaction: ChatInputCommandInteraction) => {
  const started = Date.now();
  const health = await fetchHealth();
  const serverPing = Date.now() - started;
  const discordPing = started - interaction.createdTimestamp;

  const server: Check = { name: "server", status: health ? "ok" : "error" };
  const checks = [server, ...(health?.checks ?? [])];
  const failing = checks.filter((check) => check.status === "error").length;

  await reply(
    interaction,
    brandEmbed({
      tone: failing === 0 ? "success" : "error",
      title: "Mainframe Status",
      description: failing === 0 ? "I'm alive mate" : `${failing} of ${checks.length} checks failing`,
      thumbnail: interaction.client.user.displayAvatarURL(),
      fields: [
        { name: "Latency", value: `Discord ping · ${formatMs(discordPing)}\nServer ping · ${formatMs(serverPing)}` },
        { name: "Checks", value: checks.map((check) => describe(check)).join("\n") }
      ]
    })
  );
};

// A failing check answers 503 with the same body, which is still a report worth showing. No answer
// at all is the server's own check failing, with nothing to say about the rest.
const fetchHealth = async () => {
  try {
    return await api.get("/v1/health");
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) return error.body as Health;
    if (error instanceof NetworkError) return null;
    throw error;
  }
};

// The server's own time is the ping above, so its line carries status alone.
const describe = ({ latencyMs, name, status }: Check) =>
  [capitalise(name), status.toUpperCase(), latencyMs === undefined ? null : formatMs(latencyMs)]
    .filter(Boolean)
    .join(" · ");
