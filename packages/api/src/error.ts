import type { components } from "./v1";

type ErrorBody = Partial<components["schemas"]["ErrorResponse"]>;

// A failed response is not always JSON: a proxy or a crashed server can answer with anything.
const parseBody = async (response: Response) => {
  try {
    return await response.clone().json();
  } catch {
    return;
  }
};

// Every failure a caller sees is an Error, so it can be handled without first working out what it
// was handed. The message is written by the server for people to read, so a caller shows it as it is.
// Code and status are for a caller that has to act differently, not to write its own text.
class ApiError extends Error {
  static async from(response: Response) {
    return new ApiError(response, await parseBody(response));
  }

  readonly body: unknown;
  readonly code: string | undefined;
  readonly status: number;

  private constructor(response: Response, body: unknown) {
    super((body as ErrorBody)?.message ?? response.statusText);
    this.name = "ApiError";
    this.body = body;
    this.code = (body as ErrorBody)?.code;
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
