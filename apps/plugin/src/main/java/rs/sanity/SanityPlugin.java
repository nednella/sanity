package rs.sanity;

import com.google.inject.Provides;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import net.runelite.api.Client;
import net.runelite.api.GameState;
import net.runelite.api.Player;
import net.runelite.api.events.GameStateChanged;
import net.runelite.api.events.PlayerSpawned;
import net.runelite.client.callback.ClientThread;
import net.runelite.client.config.ConfigManager;
import net.runelite.client.eventbus.Subscribe;
import net.runelite.client.events.ConfigChanged;
import net.runelite.client.plugins.Plugin;
import net.runelite.client.plugins.PluginDescriptor;
import net.runelite.client.ui.ClientToolbar;
import net.runelite.client.ui.NavigationButton;
import net.runelite.client.util.ImageUtil;
import rs.sanity.config.SanityConfig;
import rs.sanity.debug.ChatboxLogger;
import rs.sanity.modules.profile.service.ProfileService;

@Slf4j
@PluginDescriptor(
	name = "Sanity"
)
public class SanityPlugin extends Plugin
{
	@Inject
	private Client client;

	@Inject
	private ClientThread clientThread;

	@Inject
	private SanityConfig config;

	@Inject
	private ChatboxLogger chatboxLogger;

	@Inject
	private ClientToolbar clientToolbar;

	@Inject
	private ProfileService profileService;

	private NavigationButton navigationButton;

	@Override
	protected void startUp() throws Exception
	{
		chatboxLogger.start();
		chatboxLogger.setEnabled(config.debug());
		log.debug("Plugin enabled, welcome!");

		navigationButton = NavigationButton.builder()
			.tooltip("Sanity")
			.icon(ImageUtil.loadImageResource(getClass(), "panel_icon.png"))
			.panel(profileService.start())
			.build();
		clientToolbar.addNavigation(navigationButton);
		clientThread.invoke(() -> profileService.setPlayerName(playerName(client.getLocalPlayer())));
	}

	@Override
	protected void shutDown() throws Exception
	{
		log.debug("Plugin disabled.");
		clientToolbar.removeNavigation(navigationButton);
		chatboxLogger.stop();
	}

	@Subscribe
	public void onConfigChanged(ConfigChanged configChanged)
	{
		if (!configChanged.getGroup().equals(SanityConfig.GROUP))
		{
			return;
		}

		String key = configChanged.getKey();
		if (key.equals(SanityConfig.DEBUG))
		{
			chatboxLogger.setEnabled(config.debug());
		}

		if (key.equals(SanityConfig.API_KEY) || key.equals(SanityConfig.API_URL))
		{
			profileService.refresh();
		}

		log.debug("Config {} changed", key);
	}

	@Subscribe
	public void onGameStateChanged(GameStateChanged gameStateChanged)
	{
		if (gameStateChanged.getGameState() == GameState.LOGIN_SCREEN)
		{
			profileService.setPlayerName(null);
		}
	}

	@Subscribe
	public void onPlayerSpawned(PlayerSpawned playerSpawned)
	{
		Player player = playerSpawned.getPlayer();
		if (player == client.getLocalPlayer())
		{
			profileService.setPlayerName(player.getName());
		}
	}

	@Provides
	SanityConfig provideConfig(ConfigManager configManager)
	{
		return configManager.getConfig(SanityConfig.class);
	}

	private static String playerName(Player player)
	{
		return player == null ? null : player.getName();
	}
}
