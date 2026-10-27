import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { config } from "@config";

import { ApplicationError } from "./error";
import { errorResponse } from "./response";

const { isProduction } = config;

export const handleError = (error: FastifyError | ApplicationError, request: FastifyRequest, reply: FastifyReply) => {
  // Handle ApplicationError
  if (error instanceof ApplicationError)
    return errorResponse({
      request,
      reply,
      error
    });

  const { code, message, statusCode = 500 } = error;

  // Handle rate limit
  if (statusCode === 429) {
    return errorResponse({
      request,
      reply,
      error: new ApplicationError("RATE_LIMITED", statusCode, message)
    });
  }

  // Handle FastifyError
  if (code?.startsWith("FST_") && statusCode < 500) {
    return errorResponse({
      request,
      reply,
      error: new ApplicationError("REQUEST_INVALID", statusCode, message)
    });
  }

  // Unhandled error
  request.log.error({ err: error, message: "UNHANDLED ERROR!" });
  const shown = isProduction ? "Something went wrong. Please try again later." : message;
  return errorResponse({
    request,
    reply,
    error: new ApplicationError("INTERNAL_ERROR", 500, shown)
  });
};

export const handleNotFound = (request: FastifyRequest, reply: FastifyReply) => {
  return errorResponse({
    request,
    reply,
    error: new ApplicationError("ROUTE_NOT_FOUND", 404, "Route does not exist.")
  });
};
