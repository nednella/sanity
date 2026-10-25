package rs.sanity.modules.profile;

import lombok.Value;

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
		int masterDiaries;
		DiaryTier claimedTier;
	}

	@Value
	public static class DiaryTier
	{
		String name;
	}
}
