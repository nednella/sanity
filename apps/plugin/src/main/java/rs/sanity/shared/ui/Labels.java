package rs.sanity.shared.ui;

import java.awt.Color;
import javax.swing.JLabel;
import javax.swing.JTextPane;
import javax.swing.SwingConstants;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;
import net.runelite.client.ui.ColorScheme;
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

	public static JTextPane paragraph(String text)
	{
		JTextPane paragraph = new JTextPane();
		paragraph.setText(text);
		paragraph.setEditable(false);
		paragraph.setFocusable(false);
		paragraph.setOpaque(false);
		paragraph.setBorder(null);
		paragraph.setForeground(ColorScheme.LIGHT_GRAY_COLOR);
		paragraph.setFont(FontManager.getRunescapeSmallFont());

		SimpleAttributeSet centre = new SimpleAttributeSet();
		StyleConstants.setAlignment(centre, StyleConstants.ALIGN_CENTER);
		StyledDocument document = paragraph.getStyledDocument();
		document.setParagraphAttributes(0, document.getLength(), centre, false);
		return paragraph;
	}
}
