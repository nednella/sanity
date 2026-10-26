package rs.sanity.modules.profile.ui;

import static rs.sanity.shared.ui.Labels.centred;
import static rs.sanity.shared.ui.Labels.label;
import static rs.sanity.shared.ui.Labels.paragraph;
import java.awt.Color;
import javax.swing.BorderFactory;
import javax.swing.JPanel;
import net.runelite.client.ui.DynamicGridLayout;

class AccountWarning extends JPanel
{
	private static final Color BACKGROUND = new Color(58, 42, 16);
	private static final Color BORDER = new Color(90, 58, 0);
	private static final Color TITLE = new Color(255, 207, 122);

	AccountWarning(String playerName)
	{
		setLayout(new DynamicGridLayout(0, 1, 0, 6));
		setBackground(BACKGROUND);
		setBorder(BorderFactory.createCompoundBorder(
			BorderFactory.createLineBorder(BORDER),
			BorderFactory.createEmptyBorder(8, 8, 8, 8)
		));

		add(centred(label("Plugin Disabled", TITLE, true)));
		add(paragraph(playerName + " does not match your account(s) on file. Please log in to an account on file or manually update your RSN in Discord to continue using the plugin."));
	}
}
