package rs.sanity;

import com.google.inject.Provides;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import net.runelite.client.config.ConfigManager;
import net.runelite.client.eventbus.Subscribe;
import net.runelite.client.events.ConfigChanged;
import net.runelite.client.plugins.Plugin;
import net.runelite.client.plugins.PluginDescriptor;
import rs.sanity.config.SanityConfig;
import rs.sanity.debug.ChatboxLogger;

@Slf4j
@PluginDescriptor(
	name = "Sanity"
)
public class SanityPlugin extends Plugin
{
	@Inject
	private SanityConfig config;

	@Inject
	private ChatboxLogger chatboxLogger;

	@Override
	protected void startUp() throws Exception
	{
		chatboxLogger.start();
		chatboxLogger.setEnabled(config.debug());
		log.debug("Sanity started with API URL {}", config.apiUrl());
	}

	@Override
	protected void shutDown() throws Exception
	{
		log.debug("Sanity stopped");
		chatboxLogger.stop();
	}

	@Subscribe
	public void onConfigChanged(ConfigChanged configChanged)
	{
		if (!configChanged.getGroup().equals(SanityConfig.GROUP))
		{
			return;
		}

		if (configChanged.getKey().equals(SanityConfig.DEBUG))
		{
			chatboxLogger.setEnabled(config.debug());
		}

		log.debug("Config {} changed", configChanged.getKey());
	}

	@Provides
	SanityConfig provideConfig(ConfigManager configManager)
	{
		return configManager.getConfig(SanityConfig.class);
	}
}
