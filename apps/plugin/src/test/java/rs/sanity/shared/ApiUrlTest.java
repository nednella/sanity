package rs.sanity.shared;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import org.junit.Test;

public class ApiUrlTest
{
	@Test
	public void addsHttpsWhenTheApiUrlHasNoScheme()
	{
		assertEquals("https://api.sanity.rs/", ApiUrl.parse("api.sanity.rs").toString());
	}

	@Test
	public void keepsTheSchemeOfTheApiUrl()
	{
		assertEquals("http://localhost:3101/", ApiUrl.parse("http://localhost:3101").toString());
		assertEquals("https://staging.example/", ApiUrl.parse("https://staging.example").toString());
	}

	@Test
	public void rejectsAnApiUrlThatIsNotHttp()
	{
		assertNull(ApiUrl.parse("ftp://api.sanity.rs"));
	}
}
