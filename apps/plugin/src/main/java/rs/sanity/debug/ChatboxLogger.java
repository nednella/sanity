package rs.sanity.debug;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import javax.inject.Inject;
import net.runelite.api.ChatMessageType;
import net.runelite.api.Client;
import net.runelite.client.callback.ClientThread;
import org.slf4j.LoggerFactory;

public class ChatboxLogger extends AppenderBase<ILoggingEvent>
{
	private static final Logger PLUGIN_LOGGER = (Logger) LoggerFactory.getLogger("rs.sanity");

	private final Client client;
	private final ClientThread clientThread;

	@Inject
	ChatboxLogger(Client client, ClientThread clientThread)
	{
		this.client = client;
		this.clientThread = clientThread;
	}

	@Override
	public void start()
	{
		setContext(PLUGIN_LOGGER.getLoggerContext());
		super.start();
	}

	@Override
	public void stop()
	{
		setEnabled(false);
		super.stop();
	}

	public void setEnabled(boolean enabled)
	{
		if (enabled)
		{
			PLUGIN_LOGGER.setLevel(Level.DEBUG);
			PLUGIN_LOGGER.addAppender(this);
			return;
		}

		PLUGIN_LOGGER.setLevel(null);
		PLUGIN_LOGGER.detachAppender(this);
	}

	@Override
	protected void append(ILoggingEvent event)
	{
		String message = "[SANITY] " + event.getFormattedMessage();
		clientThread.invoke(() -> client.addChatMessage(ChatMessageType.GAMEMESSAGE, "", message, null));
	}
}
