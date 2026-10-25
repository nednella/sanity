package rs.sanity.shared.ui;

import static rs.sanity.shared.ui.Labels.centred;
import static rs.sanity.shared.ui.Labels.label;
import static rs.sanity.shared.ui.Labels.paragraph;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.FlowLayout;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import net.runelite.client.ui.ColorScheme;
import net.runelite.client.ui.DynamicGridLayout;
import net.runelite.client.ui.FontManager;
import net.runelite.client.util.ImageUtil;
import net.runelite.client.util.LinkBrowser;
import rs.sanity.shared.constants.Urls;
import rs.sanity.shared.error.SanityError;

class ErrorPanel extends JPanel
{
	private static final Color BUTTON = new Color(58, 42, 16);
	private static final Color BUTTON_HOVER = new Color(74, 53, 20);
	private static final Color BUTTON_BORDER = new Color(90, 58, 0);
	private static final Color BUTTON_TEXT = new Color(255, 207, 122);
	private static final Color LINK = new Color(34, 184, 245);

	ErrorPanel(SanityError error, Runnable onRefresh)
	{
		setLayout(new DynamicGridLayout(0, 1, 0, 10));
		setOpaque(false);
		setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));

		JLabel icon = centred(new JLabel(new ImageIcon(ImageUtil.loadImageResource(ErrorPanel.class, icon(error)))));
		icon.setBorder(BorderFactory.createEmptyBorder(0, 0, 4, 0));

		add(icon);
		add(centred(label(error.getTitle(), Color.WHITE, true)));
		add(paragraph(error.getMessage()));
		if (error.getDetail() != null)
		{
			add(centred(label(error.getDetail(), ColorScheme.MEDIUM_GRAY_COLOR, false)));
		}
		add(refreshButton(onRefresh));
		add(help());
	}

	private static String icon(SanityError error)
	{
		switch (error.getCode())
		{
			case "MISSING_API_KEY":
				return "error_key.png";
			case "MISSING_API_URL":
				return "error_url_missing.png";
			case "INVALID_API_URL":
				return "error_url_invalid.png";
			case "MAINFRAME_UNAVAILABLE":
				return "error_plug.png";
			default:
				return "error_lock.png";
		}
	}

	private static JButton refreshButton(Runnable onRefresh)
	{
		JButton button = new JButton("Refresh", new ImageIcon(ImageUtil.loadImageResource(ErrorPanel.class, "refresh.png")));
		button.setIconTextGap(6);
		button.setFont(FontManager.getRunescapeSmallFont());
		button.setForeground(BUTTON_TEXT);
		button.setBackground(BUTTON);
		button.setBorder(BorderFactory.createCompoundBorder(
			BorderFactory.createLineBorder(BUTTON_BORDER),
			BorderFactory.createEmptyBorder(7, 8, 7, 8)
		));
		button.setFocusPainted(false);
		button.addActionListener(event -> onRefresh.run());
		button.addMouseListener(new MouseAdapter()
		{
			@Override
			public void mouseEntered(MouseEvent event)
			{
				button.setBackground(BUTTON_HOVER);
			}

			@Override
			public void mouseExited(MouseEvent event)
			{
				button.setBackground(BUTTON);
			}
		});
		return button;
	}

	private static JPanel help()
	{
		JLabel link = label("Ask in Discord", LINK, false);
		link.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
		link.addMouseListener(new MouseAdapter()
		{
			@Override
			public void mouseClicked(MouseEvent event)
			{
				LinkBrowser.browse(Urls.SANITY_DISCORD_URL);
			}
		});

		JPanel help = new JPanel(new FlowLayout(FlowLayout.CENTER, 4, 0));
		help.setOpaque(false);
		help.setBorder(BorderFactory.createCompoundBorder(
			BorderFactory.createMatteBorder(1, 0, 0, 0, ColorScheme.DARK_GRAY_HOVER_COLOR),
			BorderFactory.createEmptyBorder(9, 0, 0, 0)
		));
		help.add(label("Need help?", ColorScheme.LIGHT_GRAY_COLOR, false));
		help.add(link);
		return help;
	}
}
