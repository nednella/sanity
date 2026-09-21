import type { Middleware } from "openapi-fetch";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/error";

// https://openapi-ts.dev/openapi-fetch/middleware-auth

const errorMiddleware: Middleware = {
  onResponse: async ({ response }) => {
    if (response.ok) return;

    // Throwing here rather than returning an error body means every failure a component sees is an
    // Error, whichever layer it came from.
    throw await ApiError.from(response);
  },
  onError: ({ request }) => {
    // TanStack Query aborts a request it no longer needs, we don't need an error toast
    // for a request we cancelled ourselves.
    if (request.signal.aborted) return;

    toast.error("A network error occurred", { description: "Please try again later" });
  }
};

export { errorMiddleware };
