package rs.sanity.modules.profile;

import lombok.Value;
import net.runelite.client.util.Text;

@Value
public class Member
{
	String displayName;
	String nationality;
	Discord discord;
	Rsn rsn;
	Membership membership;
	Diary diary;

	@Value
	public static class Discord
	{
		String avatarUrl;
	}

	@Value
	public static class Rsn
	{
		String main;
		String alt;

		public boolean includes(String name)
		{
			return sameName(main, name) || sameName(alt, name);
		}

		private static boolean sameName(String rsn, String name)
		{
			return rsn != null && Text.toJagexName(rsn).equalsIgnoreCase(Text.toJagexName(name));
		}
	}

	@Value
	public static class Membership
	{
		String joinedAt;
		Rank rank;
		int points;
	}

	@Value
	public static class Rank
	{
		String name;
		String iconUrl;
	}

	@Value
	public static class Diary
	{
		int points;
		int maxPoints;
		int masterDiaries;
		DiaryTier claimedTier;
	}

	@Value
	public static class DiaryTier
	{
		String name;
	}
}
