package rs.sanity.modules.profile.ui;

import static rs.sanity.shared.ui.Labels.label;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.image.BufferedImage;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;
import net.runelite.client.ui.ColorScheme;
import net.runelite.client.ui.DynamicGridLayout;
import net.runelite.client.util.ImageUtil;
import rs.sanity.shared.ui.Card;

class StatTile extends Card
{
	private static final int ICON_SIZE = 16;

	StatTile(String icon, String name, String value)
	{
		setBorder(BorderFactory.createCompoundBorder(
			BorderFactory.createLineBorder(ColorScheme.BORDER_COLOR),
			BorderFactory.createEmptyBorder(8, 4, 8, 4)
		));
		setLayout(new BorderLayout(8, 0));

		JPanel text = new JPanel(new DynamicGridLayout(0, 1, 0, 4));
		text.setOpaque(false);
		text.add(label(name, ColorScheme.LIGHT_GRAY_COLOR, false));
		text.add(label(value, Color.WHITE, true));

		BufferedImage image = ImageUtil.loadImageResource(StatTile.class, icon);
		BufferedImage scaled = ImageUtil.resizeImage(image, ICON_SIZE, ICON_SIZE, true);

		add(new JLabel(new ImageIcon(scaled)), BorderLayout.WEST);
		add(text, BorderLayout.CENTER);
	}
}
