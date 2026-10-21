import { type APIEmbedField, Colors, EmbedBuilder } from "discord.js";

const HEADER = "Bald Bot";
const FOOTER = "Powered by the Sanity Mainframe";

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
