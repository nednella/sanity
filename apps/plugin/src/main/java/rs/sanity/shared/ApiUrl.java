package rs.sanity.shared;

import okhttp3.HttpUrl;

public final class ApiUrl
{
	private ApiUrl()
	{
	}

	public static HttpUrl parse(String apiUrl)
	{
		String url = apiUrl.trim();
		return HttpUrl.parse(url.contains("://") ? url : "https://" + url);
	}
}
