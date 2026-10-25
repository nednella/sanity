package rs.sanity.modules.profile.service;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.swing.SwingUtilities;
import rs.sanity.api.SanityApi;
import rs.sanity.modules.profile.Member;
import rs.sanity.modules.profile.ui.ProfilePanel;
import rs.sanity.shared.ui.ImageLoader;
import rs.sanity.shared.ui.SanityPanel;

@Singleton
public class ProfileService
{
	private static final String PROFILE_PATH = "/v1/members/me";

	private final SanityApi api;
	private final ImageLoader imageLoader;
	private final AtomicInteger latestRequest = new AtomicInteger();

	private SanityPanel panel;
	private volatile String playerName;

	@Inject
	ProfileService(SanityApi api, ImageLoader imageLoader)
	{
		this.api = api;
		this.imageLoader = imageLoader;
	}

	public SanityPanel start()
	{
		panel = new SanityPanel(this::refresh);
		refresh();
		return panel;
	}

	public void refresh()
	{
		int request = latestRequest.incrementAndGet();
		api.get(
			PROFILE_PATH,
			Member.class,
			member -> showIfLatest(request, () -> panel.showContent(new ProfilePanel(member, playerName, imageLoader))),
			error -> showIfLatest(request, () -> panel.showError(error))
		);
	}

	public void setPlayerName(String playerName)
	{
		if (Objects.equals(this.playerName, playerName))
		{
			return;
		}

		this.playerName = playerName;
		refresh();
	}

	private void showIfLatest(int request, Runnable show)
	{
		SwingUtilities.invokeLater(() ->
		{
			if (request == latestRequest.get())
			{
				show.run();
			}
		});
	}
}
