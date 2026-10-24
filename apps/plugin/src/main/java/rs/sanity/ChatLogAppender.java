package rs.sanity;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import javax.inject.Inject;
import net.runelite.api.ChatMessageType;
import net.runelite.api.Client;
import net.runelite.client.callback.ClientThread;

class ChatLogAppender extends AppenderBase<ILoggingEvent>
{
	private final Client client;
	private final ClientThread clientThread;

	@Inject
	ChatLogAppender(Client client, ClientThread clientThread)
	{
		this.client = client;
		this.clientThread = clientThread;
	}

	@Override
	protected void append(ILoggingEvent event)
	{
		String message = "[SANITY] " + event.getFormattedMessage();
		clientThread.invoke(() -> client.addChatMessage(ChatMessageType.GAMEMESSAGE, "", message, null));
	}
}
