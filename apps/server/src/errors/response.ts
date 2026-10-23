import type { FastifyReply, FastifyRequest } from "fastify";

import type { ApplicationError } from "./error";

type ErrorResponseOptions = {
  request: FastifyRequest;
  reply: FastifyReply;
  error: ApplicationError;
};

export const errorResponse = ({ request, reply, error }: ErrorResponseOptions) => {
  return reply.code(error.statusCode).send({
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    url: request.url
  });
};
