type ErrorBody = { message?: string };

// A failed response is not always JSON: a proxy or a crashed server can answer with anything.
const parseBody = async (response: Response) => {
  try {
    return await response.clone().json();
  } catch {
    return;
  }
};

// Every failure a caller sees is an Error, so it can be handled without first working out what it
// was handed. Status is what a caller branches on: 404 means "say it doesn't exist".
class ApiError extends Error {
  static async from(response: Response) {
    return new ApiError(response, await parseBody(response));
  }

  readonly body: unknown;
  readonly status: number;

  private constructor(response: Response, body: unknown) {
    super((body as ErrorBody)?.message ?? response.statusText);
    this.name = "ApiError";
    this.body = body;
    this.status = response.status;
  }
}

class NetworkError extends Error {
  constructor(cause: unknown) {
    super("network_error", { cause });
    this.name = "NetworkError";
  }
}

export { ApiError, NetworkError };
