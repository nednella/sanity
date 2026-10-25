package rs.sanity.config;

import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import rs.sanity.shared.ApiUrl;
import rs.sanity.shared.error.SanityError;

@Getter
@AllArgsConstructor
public enum ConfigError implements SanityError
{
	MISSING_API_KEY(
		"Missing API Key",
		"Get your unique key from our Discord server and drop it into the plugin settings."
	),
	MISSING_API_URL(
		"Missing API URL",
		"The API URL in the plugin settings is empty."
	),
	INVALID_API_URL(
		"Invalid API URL",
		"The API URL in the plugin settings is not a valid web address."
	);

	private final String title;
	private final String message;

	@Override
	public String getCode()
	{
		return name();
	}

	@Override
	public String getDetail()
	{
		return null;
	}

	public static Optional<ConfigError> check(SanityConfig config)
	{
		if (config.apiKey().isBlank())
		{
			return Optional.of(MISSING_API_KEY);
		}

		if (config.apiUrl().isBlank())
		{
			return Optional.of(MISSING_API_URL);
		}

		if (ApiUrl.parse(config.apiUrl()) == null)
		{
			return Optional.of(INVALID_API_URL);
		}

		return Optional.empty();
	}
}
