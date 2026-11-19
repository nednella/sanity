import { ButtonBuilder, ButtonStyle } from "discord.js";

export function linkButton(label: string, url: string) {
  return new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(url);
}
