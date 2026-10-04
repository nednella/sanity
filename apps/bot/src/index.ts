import { Client, Events, GatewayIntentBits } from "discord.js";

import { config } from "@config";

import { onInteractionCreate } from "./events/on-interaction-create";
import { onReady } from "./events/on-ready";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteractionCreate);

await client.login(config.discordToken);
