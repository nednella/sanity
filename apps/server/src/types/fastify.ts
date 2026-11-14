import type { Auth } from "@/modules/auth/hooks/authenticate";
import type { RouteAccess } from "@/modules/auth/hooks/authorise";

declare module "fastify" {
  interface FastifyContextConfig {
    access?: RouteAccess;
  }

  interface FastifyRequest {
    auth: Auth;
  }
}
