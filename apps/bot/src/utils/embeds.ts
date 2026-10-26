import { type APIEmbedField, Colors, EmbedBuilder } from "discord.js";

const HEADER = "Bald Bot";
const FOOTER = "Powered by the Sanity Mainframe";
const OVERFLOW_LINE_ROOM = 20;

const STYLES = {
  brand: { colour: 0x22_d3_ee, icon: null },
  error: { colour: Colors.Red, icon: "❌" },
  info: { colour: Colors.Blurple, icon: "ℹ️" },
  success: { colour: Colors.Green, icon: "✅" },
  warning: { colour: Colors.Yellow, icon: "⚠️" }
};

type EmbedOptions = {
  description?: string;
  fields?: APIEmbedField[];
  style?: keyof typeof STYLES;
  thumbnail?: string;
  title?: string;
};

export const buildEmbed = ({ description, fields, style = "brand", thumbnail, title = HEADER }: EmbedOptions) => {
  const { colour, icon } = STYLES[style];
  const embed = new EmbedBuilder()
    .setColor(colour)
    .setTitle(icon ? `${icon} ${title}` : title)
    .setFooter({ text: FOOTER })
    .setTimestamp();
  if (description) embed.setDescription(description);
  if (fields) embed.addFields(fields);
  if (thumbnail) embed.setThumbnail(thumbnail);
  return embed;
};

// A long list stops short of the limit and counts the lines it leaves out.
export function fitLines(lines: string[], limit: number) {
  const shown: string[] = [];
  let length = 0;
  for (const line of lines) {
    length += line.length + 1;
    if (length > limit - OVERFLOW_LINE_ROOM) break;
    shown.push(line);
  }

  const hidden = lines.length - shown.length;
  return (hidden === 0 ? shown : [...shown, `…and ${hidden} more`]).join("\n");
}
