package rs.sanity.shared.ui;

import java.awt.Color;
import javax.swing.JLabel;
import javax.swing.SwingConstants;
import net.runelite.client.ui.FontManager;

public final class Labels
{
	private Labels()
	{
	}

	public static JLabel label(String text, Color color, boolean bold)
	{
		JLabel label = new JLabel(text);
		label.setForeground(color);
		label.setFont(bold ? FontManager.getRunescapeBoldFont() : FontManager.getRunescapeSmallFont());
		return label;
	}

	public static JLabel centred(JLabel label)
	{
		label.setHorizontalAlignment(SwingConstants.CENTER);
		return label;
	}
}
