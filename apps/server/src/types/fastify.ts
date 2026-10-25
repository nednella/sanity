import type { Auth } from "@/modules/auth/hooks/authenticate";

declare module "fastify" {
  interface FastifyRequest {
    auth: Auth;
  }
}
