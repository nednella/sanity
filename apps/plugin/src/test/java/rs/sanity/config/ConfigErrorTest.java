package rs.sanity.config;

import static org.junit.Assert.assertEquals;
import java.util.Optional;
import org.junit.Test;

public class ConfigErrorTest
{
	@Test
	public void reportsABlankKey()
	{
		assertEquals(Optional.of(ConfigError.MISSING_API_KEY), ConfigError.check(config(" ", "api.sanity.rs")));
	}

	@Test
	public void reportsABlankApiUrl()
	{
		assertEquals(Optional.of(ConfigError.MISSING_API_URL), ConfigError.check(config("key", " ")));
	}

	@Test
	public void reportsAnApiUrlThatIsNotHttp()
	{
		assertEquals(Optional.of(ConfigError.INVALID_API_URL), ConfigError.check(config("key", "ftp://api.sanity.rs")));
	}

	@Test
	public void acceptsAKeyAndAnApiUrl()
	{
		assertEquals(Optional.empty(), ConfigError.check(config("key", "api.sanity.rs")));
	}

	private static SanityConfig config(String apiKey, String apiUrl)
	{
		return new SanityConfig()
		{
			@Override
			public String apiKey()
			{
				return apiKey;
			}

			@Override
			public String apiUrl()
			{
				return apiUrl;
			}
		};
	}
}
