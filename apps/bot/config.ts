type Config = {
  apiUrl: string;
  discordClientId: string;
  discordGuildId: string;
  discordToken: string;
  logLevel: string;
  webUrl: string;
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
};

export const config: Config = {
  apiUrl: required("API_URL"),
  discordClientId: required("DISCORD_CLIENT_ID"),
  discordGuildId: required("DISCORD_GUILD_ID"),
  discordToken: required("DISCORD_TOKEN"),
  logLevel: required("LOG_LEVEL"),
  webUrl: required("WEB_URL")
};
