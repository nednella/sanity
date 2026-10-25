package rs.sanity.modules.profile.ui;

import java.awt.GridLayout;
import javax.swing.JPanel;
import net.runelite.client.ui.DynamicGridLayout;
import rs.sanity.modules.profile.Member;
import rs.sanity.shared.ui.ImageLoader;

public class ProfilePanel extends JPanel
{
	public ProfilePanel(Member member, String playerName, ImageLoader imageLoader)
	{
		setLayout(new DynamicGridLayout(0, 1, 0, 8));
		if (playerName != null && !member.getRsn().includes(playerName))
		{
			add(new AccountWarning(playerName));
		}
		add(new ProfileHeader(member, imageLoader));
		add(new RankCard(member.getMembership().getRank(), imageLoader));
		add(stats(member));
	}

	private static JPanel stats(Member member)
	{
		Member.Diary diary = member.getDiary();
		Member.DiaryTier tier = diary.getClaimedTier();

		JPanel grid = new JPanel(new GridLayout(2, 2, 4, 4));
		grid.setOpaque(false);
		grid.add(new StatTile("clan_points.png", "Clan Points", ProfileText.number(member.getMembership().getPoints())));
		grid.add(new StatTile("diary_points.png", "Diary Points", ProfileText.diaryPoints(diary)));
		grid.add(new StatTile("diary_master.png", "Master Diaries", ProfileText.number(diary.getMasterDiaries())));
		grid.add(tier == null
			? new StatTile("diary_easy.png", "Diary Tier", "None")
			: new StatTile("diary_" + tier.getName().toLowerCase() + ".png", "Diary Tier", tier.getName()));
		return grid;
	}
}
