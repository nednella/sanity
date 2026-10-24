package rs.sanity;

import net.runelite.client.config.Config;
import net.runelite.client.config.ConfigGroup;
import net.runelite.client.config.ConfigItem;

@ConfigGroup(SanityConfig.GROUP)
public interface SanityConfig extends Config
{
	String GROUP = "sanity";

	@ConfigItem(
		keyName = "apiUrl",
		name = "API URL",
		description = "The Sanity API to talk to. Change it only for local development",
		position = 0
	)
	default String apiUrl()
	{
		return "api.sanity.rs";
	}

	@ConfigItem(
		keyName = "apiKey",
		name = "API Key",
		description = "Your key from the /plugin-key command in the Sanity Discord",
		position = 1,
		secret = true
	)
	default String apiKey()
	{
		return "";
	}

	@ConfigItem(
		keyName = "debug",
		name = "Enable debug",
		description = "Write plugin debug logs to the client chat box and log file",
		position = 2
	)
	default boolean debug()
	{
		return false;
	}
}
