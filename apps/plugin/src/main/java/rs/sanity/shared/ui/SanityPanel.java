package rs.sanity.shared.ui;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import javax.swing.JComponent;
import javax.swing.JPanel;
import net.runelite.client.ui.PluginPanel;
import rs.sanity.shared.error.SanityError;

public class SanityPanel extends PluginPanel
{
	private final Runnable onRefresh;

	private boolean fillsHeight;

	public SanityPanel(Runnable onRefresh)
	{
		this.onRefresh = onRefresh;
		setLayout(new BorderLayout());
	}

	@Override
	public Dimension getPreferredSize()
	{
		Dimension size = super.getPreferredSize();
		if (fillsHeight)
		{
			size.height = Math.max(size.height, getScrollPane().getViewport().getHeight());
		}
		return size;
	}

	@Override
	public void onActivate()
	{
		onRefresh.run();
	}

	public void showContent(JComponent content)
	{
		fillsHeight = false;
		show(content);
	}

	public void showError(SanityError error)
	{
		JPanel centre = new JPanel(new GridBagLayout());
		centre.setOpaque(false);
		GridBagConstraints constraints = new GridBagConstraints();
		constraints.fill = GridBagConstraints.HORIZONTAL;
		constraints.weightx = 1;
		centre.add(new ErrorPanel(error, onRefresh), constraints);

		fillsHeight = true;
		show(centre);
	}

	private void show(JComponent view)
	{
		removeAll();
		add(view, BorderLayout.CENTER);
		revalidate();
		repaint();
	}
}
