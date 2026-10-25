package rs.sanity.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.Value;
import rs.sanity.shared.error.SanityError;

@Value
public class ApiError implements SanityError
{
	private static final Set<String> ACRONYMS = Set.of("API", "ID", "URL");

	public static final ApiError MAINFRAME_UNAVAILABLE = new ApiError(
		503,
		"MAINFRAME_UNAVAILABLE",
		"The Sanity API did not answer. Try again in a few minutes."
	);

	Integer status;
	String code;
	String message;

	@Override
	public String getTitle()
	{
		List<String> words = new ArrayList<>();
		for (String word : code.split("_"))
		{
			if (word.isEmpty())
			{
				continue;
			}

			words.add(ACRONYMS.contains(word) ? word : word.charAt(0) + word.substring(1).toLowerCase());
		}

		return String.join(" ", words);
	}

	@Override
	public String getDetail()
	{
		return status == null ? null : status + " · " + code;
	}
}
