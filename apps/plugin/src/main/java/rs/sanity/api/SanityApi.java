package rs.sanity.api;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import java.io.IOException;
import java.util.Optional;
import java.util.function.Consumer;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import rs.sanity.config.ConfigError;
import rs.sanity.config.SanityConfig;
import rs.sanity.shared.ApiUrl;
import rs.sanity.shared.error.SanityError;

@Slf4j
public class SanityApi
{
	private final OkHttpClient okHttpClient;
	private final Gson gson;
	private final SanityConfig config;

	@Inject
	SanityApi(OkHttpClient okHttpClient, Gson gson, SanityConfig config)
	{
		this.okHttpClient = okHttpClient;
		this.gson = gson;
		this.config = config;
	}

	public <T> void get(String path, Class<T> type, Consumer<T> onResult, Consumer<SanityError> onError)
	{
		Optional<ConfigError> configError = ConfigError.check(config);
		if (configError.isPresent())
		{
			onError.accept(configError.get());
			return;
		}

		HttpUrl url = ApiUrl.parse(config.apiUrl()).resolve(path);
		Request request = new Request.Builder()
			.url(url)
			.header("Authorization", "Bearer " + config.apiKey().trim())
			.build();

		log.debug("Requesting {}", url);
		okHttpClient.newCall(request).enqueue(new Callback()
		{
			@Override
			public void onFailure(Call call, IOException e)
			{
				log.debug("Request to {} failed", url, e);
				onError.accept(ApiError.MAINFRAME_UNAVAILABLE);
			}

			@Override
			public void onResponse(Call call, Response response) throws IOException
			{
				try (response)
				{
					log.debug("Request to {} returned {}", url, response.code());
					if (!response.isSuccessful())
					{
						onError.accept(readError(response));
						return;
					}

					T result = read(response, type);
					if (result == null)
					{
						onError.accept(ApiError.MAINFRAME_UNAVAILABLE);
						return;
					}

					onResult.accept(result);
				}
			}
		});
	}

	private ApiError readError(Response response)
	{
		ApiError body = read(response, ApiError.class);
		if (body == null || body.getCode() == null || body.getMessage() == null)
		{
			return ApiError.MAINFRAME_UNAVAILABLE;
		}

		return new ApiError(response.code(), body.getCode(), body.getMessage());
	}

	private <T> T read(Response response, Class<T> type)
	{
		try
		{
			return gson.fromJson(response.body().charStream(), type);
		}
		catch (JsonParseException e)
		{
			log.debug("Response is not the expected JSON", e);
			return null;
		}
	}
}
