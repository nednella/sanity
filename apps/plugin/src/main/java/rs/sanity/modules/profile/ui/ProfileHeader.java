package rs.sanity.modules.profile.ui;

import static rs.sanity.shared.ui.Labels.centred;
import static rs.sanity.shared.ui.Labels.label;
import java.awt.Color;
import java.awt.FlowLayout;
import javax.swing.BorderFactory;
import javax.swing.JPanel;
import net.runelite.client.ui.ColorScheme;
import net.runelite.client.ui.DynamicGridLayout;
import okhttp3.HttpUrl;
import rs.sanity.modules.profile.Member;
import rs.sanity.shared.constants.Urls;
import rs.sanity.shared.ui.GlowCard;
import rs.sanity.shared.ui.ImageLoader;

class ProfileHeader extends GlowCard
{
	private static final int AVATAR_REQUEST_SIZE = 64;
	private static final int FLAG_WIDTH = 40;

	ProfileHeader(Member member, ImageLoader imageLoader)
	{
		setBorder(BorderFactory.createCompoundBorder(
			BorderFactory.createLineBorder(ColorScheme.BORDER_COLOR),
			BorderFactory.createEmptyBorder(14, 8, 12, 8)
		));
		setLayout(new DynamicGridLayout(0, 1, 0, 6));

		add(avatar(member, imageLoader));
		add(centred(label(member.getDisplayName(), Color.WHITE, true)));

		String names = ProfileText.names(member.getRsn());
		if (!names.isEmpty())
		{
			add(centred(label(names, ColorScheme.LIGHT_GRAY_COLOR, false)));
		}

		String joinedAt = member.getMembership().getJoinedAt();
		if (joinedAt != null)
		{
			add(centred(label(ProfileText.joined(joinedAt), ColorScheme.LIGHT_GRAY_COLOR, false)));
		}
	}

	private static JPanel avatar(Member member, ImageLoader imageLoader)
	{
		Avatar avatar = new Avatar();

		HttpUrl pictureUrl = pictureUrl(member.getDiscord().getAvatarUrl());
		if (pictureUrl != null)
		{
			imageLoader.load(pictureUrl.toString(), avatar::setPicture);
		}

		if (member.getNationality() != null)
		{
			imageLoader.load(flagUrl(member.getNationality()), avatar::setFlag);
		}

		JPanel row = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
		row.setOpaque(false);
		row.setBorder(BorderFactory.createEmptyBorder(0, 0, 4, 0));
		row.add(avatar);
		return row;
	}

	private static HttpUrl pictureUrl(String avatarUrl)
	{
		HttpUrl url = avatarUrl == null ? null : HttpUrl.parse(avatarUrl);
		if (url == null)
		{
			return null;
		}

		return url.newBuilder().setQueryParameter("size", String.valueOf(AVATAR_REQUEST_SIZE)).build();
	}

	private static String flagUrl(String nationality)
	{
		return Urls.FLAG_CDN_URL + "/w" + FLAG_WIDTH + "/" + nationality.toLowerCase() + ".png";
	}
}
