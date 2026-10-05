import { type APIEmbedField, Colors, EmbedBuilder } from "discord.js";

const HEADER = "Bald Bot";
const FOOTER = "Powered by the Sanity Mainframe";
const BRAND_COLOUR = 0x22_d3_ee;

const COLOURS = {
  error: Colors.Red,
  info: Colors.Blurple,
  success: Colors.Green,
  warning: Colors.Yellow
};

type Tone = keyof typeof COLOURS;

type EmbedOptions = {
  description?: string;
  fields?: APIEmbedField[];
  thumbnail?: string;
  title?: string;
};

const build = (colour: number, { description, fields, thumbnail, title }: EmbedOptions) => {
  const embed = new EmbedBuilder().setColor(colour);
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields) embed.addFields(fields);
  if (thumbnail) embed.setThumbnail(thumbnail);
  return embed;
};

// A tone says how things went; without one the brand colour stands.
export const brandEmbed = ({ tone, ...options }: EmbedOptions & { tone?: Tone }) =>
  build(tone ? COLOURS[tone] : BRAND_COLOUR, { title: HEADER, ...options })
    .setFooter({ text: FOOTER })
    .setTimestamp();

const embed = (tone: Tone, options: EmbedOptions) => build(COLOURS[tone], options);
export const errorEmbed = (options: EmbedOptions) => embed("error", options);
export const infoEmbed = (options: EmbedOptions) => embed("info", options);
export const successEmbed = (options: EmbedOptions) => embed("success", options);
export const warningEmbed = (options: EmbedOptions) => embed("warning", options);
