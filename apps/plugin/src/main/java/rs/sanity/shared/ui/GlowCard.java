package rs.sanity.shared.ui;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RadialGradientPaint;
import java.awt.geom.Point2D;

public class GlowCard extends Card
{
	private static final Color GLOW = new Color(220, 138, 0, 56);
	private static final Color NO_GLOW = new Color(220, 138, 0, 0);

	@Override
	protected void paintComponent(Graphics g)
	{
		super.paintComponent(g);

		Graphics2D g2 = (Graphics2D) g.create();
		Point2D centre = new Point2D.Float(getWidth() / 2f, getHeight() * 0.38f);
		float radius = Math.max(1, getWidth() * 0.6f);
		g2.setPaint(new RadialGradientPaint(centre, radius, new float[]{0f, 1f}, new Color[]{GLOW, NO_GLOW}));
		g2.fillRect(0, 0, getWidth(), getHeight());
		g2.dispose();
	}
}
