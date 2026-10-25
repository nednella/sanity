package rs.sanity.modules.profile.ui;

import java.text.NumberFormat;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import rs.sanity.modules.profile.Member;

final class ProfileText
{
	private static final NumberFormat NUMBERS = NumberFormat.getIntegerInstance(Locale.ENGLISH);
	private static final DateTimeFormatter DATES = DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);

	private ProfileText()
	{
	}

	static String names(Member.Rsn rsn)
	{
		if (rsn.getMain() == null)
		{
			return rsn.getAlt() == null ? "" : rsn.getAlt();
		}

		return rsn.getAlt() == null ? rsn.getMain() : rsn.getMain() + " / " + rsn.getAlt();
	}

	static String joined(String joinedAt)
	{
		return "Joined " + DATES.format(Instant.parse(joinedAt).atZone(ZoneOffset.UTC));
	}

	static String number(int value)
	{
		return NUMBERS.format(value);
	}

	static String diaryPoints(Member.Diary diary)
	{
		return number(diary.getPoints()) + " / " + number(diary.getMaxPoints());
	}
}
