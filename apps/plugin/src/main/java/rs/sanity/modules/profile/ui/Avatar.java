package rs.sanity.modules.profile.ui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Graphics;
import java.awt.RenderingHints;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;
import javax.swing.JComponent;
import net.runelite.client.ui.ColorScheme;

class Avatar extends JComponent
{
	private static final int SIZE = 56;
	private static final int FLAG_SIZE = 18;
	private static final Color RING = new Color(90, 58, 0);
	private static final Color EMPTY = new Color(58, 58, 58);
	private static final Color SILHOUETTE = new Color(107, 107, 107);

	private transient BufferedImage picture;
	private transient BufferedImage flag;

	Avatar()
	{
		Dimension size = new Dimension(SIZE + 4, SIZE + 4);
		setPreferredSize(size);
		setMinimumSize(size);
	}

	void setPicture(BufferedImage picture)
	{
		this.picture = picture;
		repaint();
	}

	void setFlag(BufferedImage flag)
	{
		this.flag = flag;
		repaint();
	}

	@Override
	protected void paintComponent(Graphics g)
	{
		Graphics2D g2 = (Graphics2D) g.create();
		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);

		g2.setColor(RING);
		g2.fill(new Ellipse2D.Float(0, 0, SIZE + 3f, SIZE + 3f));
		g2.setColor(ColorScheme.DARKER_GRAY_COLOR);
		g2.fill(new Ellipse2D.Float(1, 1, SIZE + 1f, SIZE + 1f));

		Ellipse2D.Float circle = new Ellipse2D.Float(2, 2, SIZE - 1f, SIZE - 1f);
		if (picture == null)
		{
			paintSilhouette(g2, circle);
		}
		else
		{
			paintClipped(g2, picture, circle);
		}

		if (flag != null)
		{
			float x = SIZE + 3f - FLAG_SIZE;
			g2.setColor(ColorScheme.DARKER_GRAY_COLOR);
			g2.fill(new Ellipse2D.Float(x - 2, x - 2, FLAG_SIZE + 4f, FLAG_SIZE + 4f));
			paintClipped(g2, flag, new Ellipse2D.Float(x, x, FLAG_SIZE, FLAG_SIZE));
		}

		g2.dispose();
	}

	private static void paintSilhouette(Graphics2D g2, Ellipse2D.Float circle)
	{
		g2.setColor(EMPTY);
		g2.fill(circle);

		Graphics2D clipped = (Graphics2D) g2.create();
		clipped.clip(circle);
		clipped.setColor(SILHOUETTE);

		float unit = circle.width / 56f;
		float x = circle.x;
		float y = circle.y;
		clipped.fill(new Ellipse2D.Float(x + 18 * unit, y + 12 * unit, 20 * unit, 20 * unit));

		Path2D.Float shoulders = new Path2D.Float();
		shoulders.moveTo(x + 8 * unit, y + 56 * unit);
		shoulders.curveTo(x + 8 * unit, y + 40 * unit, x + 18 * unit, y + 34 * unit, x + 28 * unit, y + 34 * unit);
		shoulders.curveTo(x + 38 * unit, y + 34 * unit, x + 48 * unit, y + 40 * unit, x + 48 * unit, y + 56 * unit);
		shoulders.closePath();
		clipped.fill(shoulders);
		clipped.dispose();
	}

	private static void paintClipped(Graphics2D g2, BufferedImage image, Ellipse2D.Float circle)
	{
		Graphics2D clipped = (Graphics2D) g2.create();
		clipped.clip(circle);

		float scale = Math.max(circle.width / image.getWidth(), circle.height / image.getHeight());
		int width = Math.round(image.getWidth() * scale);
		int height = Math.round(image.getHeight() * scale);
		int x = Math.round(circle.x + (circle.width - width) / 2);
		int y = Math.round(circle.y + (circle.height - height) / 2);
		clipped.drawImage(image, x, y, width, height, null);
		clipped.dispose();
	}
}
