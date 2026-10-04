import { Client, Events, GatewayIntentBits } from "discord.js";

import { config } from "@config";

import { onReady } from "./events/on-ready";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once(Events.ClientReady, onReady);

await client.login(config.discordToken);
