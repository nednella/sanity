package rs.sanity.modules.profile.ui;

import static rs.sanity.shared.ui.Labels.centred;
import static rs.sanity.shared.ui.Labels.label;
import java.awt.BorderLayout;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import net.runelite.client.ui.ColorScheme;
import rs.sanity.modules.profile.Member;
import rs.sanity.shared.ui.Card;
import rs.sanity.shared.ui.ImageLoader;

class RankCard extends Card
{
	RankCard(Member.Rank rank, ImageLoader imageLoader)
	{
		JLabel label = centred(label(rank.getName(), ColorScheme.BRAND_ORANGE, true));
		label.setIconTextGap(5);
		if (rank.getIconUrl() != null)
		{
			imageLoader.load(rank.getIconUrl(), image -> label.setIcon(new ImageIcon(padBottom(image, 2))));
		}

		setLayout(new BorderLayout());
		add(label, BorderLayout.CENTER);
	}

	// JLabel centres an icon on the whole text box, but RuneScape capitals sit above its centre.
	private static BufferedImage padBottom(BufferedImage image, int rows)
	{
		BufferedImage padded = new BufferedImage(image.getWidth(), image.getHeight() + rows, BufferedImage.TYPE_INT_ARGB);
		Graphics2D graphics = padded.createGraphics();
		graphics.drawImage(image, 0, 0, null);
		graphics.dispose();
		return padded;
	}
}
