import type { Middleware } from "openapi-fetch";
import { toast } from "sonner";

// https://openapi-ts.dev/openapi-fetch/middleware-auth

const errorMiddleware: Middleware = {
  onError: ({ request }) => {
    // TanStack Query aborts a request it no longer needs, we don't need an error toast
    // for a request we cancelled ourselves.
    if (request.signal.aborted) return;

    toast.error("A network error occurred", { description: "Please try again later" });
  }
};

export { errorMiddleware };
