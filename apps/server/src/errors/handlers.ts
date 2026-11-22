import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { config } from "@config";

import { ApplicationError } from "./error";
import { errorResponse } from "./response";

const { isProduction } = config;

export function handleError(error: ApplicationError | FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const applicationError = toApplicationError(error);
  if (applicationError.statusCode >= 500) request.log.error({ err: error, message: "UNHANDLED ERROR!" });

  return errorResponse({
    request,
    reply,
    error: applicationError
  });
}

export function handleNotFound(request: FastifyRequest, reply: FastifyReply) {
  return errorResponse({
    request,
    reply,
    error: new ApplicationError("ROUTE_NOT_FOUND", 404, "Route does not exist.")
  });
}

export function toApplicationError(error: ApplicationError | FastifyError) {
  if (error instanceof ApplicationError) {
    return error;
  }

  const { code, message, statusCode = 500 } = error;

  // Handle rate limit
  if (statusCode === 429) {
    return new ApplicationError("RATE_LIMITED", statusCode, message);
  }

  // Handle FastifyError
  if (code?.startsWith("FST_") && statusCode < 500) {
    return new ApplicationError("REQUEST_INVALID", statusCode, message);
  }

  // Unhandled error
  const shown = isProduction ? "Something went wrong. Please try again later." : message;
  return new ApplicationError("INTERNAL_ERROR", 500, shown);
}
