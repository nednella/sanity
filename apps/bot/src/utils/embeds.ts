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

const ICONS = {
  error: "❌",
  info: "ℹ️",
  success: "✅",
  warning: "⚠️"
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
  return embed.setFooter({ text: FOOTER }).setTimestamp();
};

// A tone says how things went; without one the brand colour stands.
export const brandEmbed = ({ tone, ...options }: EmbedOptions & { tone?: Tone }) =>
  build(tone ? COLOURS[tone] : BRAND_COLOUR, { title: HEADER, ...options });

type ToneOptions = EmbedOptions & { title: string };

const embed = (tone: Tone, { title, ...options }: ToneOptions) =>
  build(COLOURS[tone], { title: `${ICONS[tone]} ${title}`, ...options });
export const errorEmbed = (options: ToneOptions) => embed("error", options);
export const infoEmbed = (options: ToneOptions) => embed("info", options);
export const successEmbed = (options: ToneOptions) => embed("success", options);
export const warningEmbed = (options: ToneOptions) => embed("warning", options);
