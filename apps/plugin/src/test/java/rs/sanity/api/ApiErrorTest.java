package rs.sanity.api;

import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class ApiErrorTest
{
	@Test
	public void titlesTheErrorCode()
	{
		assertEquals("Route Not Found", new ApiError(404, "ROUTE_NOT_FOUND", "").getTitle());
	}

	@Test
	public void keepsAcronymsInCapitals()
	{
		assertEquals("Invalid API Key", new ApiError(401, "INVALID_API_KEY", "").getTitle());
	}

	@Test
	public void titlesTheNoAnswerError()
	{
		assertEquals("Mainframe Unavailable", ApiError.MAINFRAME_UNAVAILABLE.getTitle());
	}

	@Test
	public void showsTheStatusWithTheCode()
	{
		assertEquals("401 · INVALID_API_KEY", new ApiError(401, "INVALID_API_KEY", "").getDetail());
	}

	@Test
	public void showsUnavailableWhenTheApiDoesNotAnswer()
	{
		assertEquals("503 · MAINFRAME_UNAVAILABLE", ApiError.MAINFRAME_UNAVAILABLE.getDetail());
	}
}
