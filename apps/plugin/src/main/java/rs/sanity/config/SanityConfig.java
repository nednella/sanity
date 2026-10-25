package rs.sanity.config;

import net.runelite.client.config.Config;
import net.runelite.client.config.ConfigGroup;
import net.runelite.client.config.ConfigItem;

@ConfigGroup(SanityConfig.GROUP)
public interface SanityConfig extends Config
{
	String GROUP = "sanity";
	String API_URL = "apiUrl";
	String API_KEY = "apiKey";
	String DEBUG = "debug";

	@ConfigItem(
		keyName = API_URL,
		name = "API URL",
		description = "The Sanity API web address (don't change this unless for local development!)",
		position = 0
	)
	default String apiUrl()
	{
		return "api.sanity.rs";
	}

	@ConfigItem(
		keyName = API_KEY,
		name = "API Key",
		description = "Your unique plugin key from the Sanity Discord server",
		position = 1,
		secret = true
	)
	default String apiKey()
	{
		return "";
	}

	@ConfigItem(
		keyName = DEBUG,
		name = "Enable debug",
		description = "Write plugin debug logs to the client chat box and log file",
		position = 2
	)
	default boolean debug()
	{
		return false;
	}
}
