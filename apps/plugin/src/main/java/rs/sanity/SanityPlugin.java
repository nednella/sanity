package rs.sanity;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.google.inject.Provides;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import net.runelite.client.config.ConfigManager;
import net.runelite.client.eventbus.Subscribe;
import net.runelite.client.events.ConfigChanged;
import net.runelite.client.plugins.Plugin;
import net.runelite.client.plugins.PluginDescriptor;
import org.slf4j.LoggerFactory;
import rs.sanity.config.SanityConfig;

@Slf4j
@PluginDescriptor(
	name = "Sanity"
)
public class SanityPlugin extends Plugin
{
	private static final Logger PLUGIN_LOGGER = (Logger) LoggerFactory.getLogger("rs.sanity");

	@Inject
	private SanityConfig config;

	@Inject
	private ChatLogAppender chatLogAppender;

	@Override
	protected void startUp() throws Exception
	{
		chatLogAppender.setContext(PLUGIN_LOGGER.getLoggerContext());
		chatLogAppender.start();
		applyDebugLogging(config.debug());
		log.debug("Sanity started with API URL {}", config.apiUrl());
	}

	@Override
	protected void shutDown() throws Exception
	{
		log.debug("Sanity stopped");
		applyDebugLogging(false);
		chatLogAppender.stop();
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
			applyDebugLogging(config.debug());
		}

		log.debug("Config {} changed", configChanged.getKey());
	}

	@Provides
	SanityConfig provideConfig(ConfigManager configManager)
	{
		return configManager.getConfig(SanityConfig.class);
	}

	private void applyDebugLogging(boolean enabled)
	{
		if (enabled)
		{
			PLUGIN_LOGGER.setLevel(Level.DEBUG);
			PLUGIN_LOGGER.addAppender(chatLogAppender);
			return;
		}

		PLUGIN_LOGGER.setLevel(null);
		PLUGIN_LOGGER.detachAppender(chatLogAppender);
	}
}
