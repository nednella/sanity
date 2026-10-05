import { z } from "zod";

const checkStatus = z.enum(["error", "ok"]);

const check = z.object({
  name: z.string(),
  status: checkStatus,
  latencyMs: z.number()
});

export const health = z
  .object({
    status: checkStatus,
    checks: z.array(check)
  })
  .register(z.globalRegistry, { id: "Health" });
