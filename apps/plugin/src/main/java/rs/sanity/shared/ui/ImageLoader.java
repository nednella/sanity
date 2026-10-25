package rs.sanity.shared.ui;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import javax.imageio.ImageIO;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.swing.SwingUtilities;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Slf4j
@Singleton
public class ImageLoader
{
	private final OkHttpClient okHttpClient;
	private final Map<String, BufferedImage> cache = new ConcurrentHashMap<>();

	@Inject
	ImageLoader(OkHttpClient okHttpClient)
	{
		this.okHttpClient = okHttpClient;
	}

	public void load(String url, Consumer<BufferedImage> onImage)
	{
		BufferedImage cached = cache.get(url);
		if (cached != null)
		{
			SwingUtilities.invokeLater(() -> onImage.accept(cached));
			return;
		}

		Request request = new Request.Builder().url(url).build();
		okHttpClient.newCall(request).enqueue(new Callback()
		{
			@Override
			public void onFailure(Call call, IOException e)
			{
				log.debug("Image request to {} failed", url, e);
			}

			@Override
			public void onResponse(Call call, Response response) throws IOException
			{
				try (response; InputStream in = response.body().byteStream())
				{
					if (!response.isSuccessful())
					{
						log.debug("Image request to {} returned {}", url, response.code());
						return;
					}

					BufferedImage image;
					synchronized (ImageIO.class)
					{
						image = ImageIO.read(in);
					}

					if (image == null)
					{
						log.debug("Image at {} is not a readable image", url);
						return;
					}

					cache.put(url, image);
					SwingUtilities.invokeLater(() -> onImage.accept(image));
				}
			}
		});
	}
}
