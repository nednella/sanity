import { pingDatabase } from "../repository/ping-database";

const timed = async (name: string, run: () => Promise<void>) => {
  const started = performance.now();
  let status: "error" | "ok" = "ok";
  try {
    await run();
  } catch {
    status = "error";
  }

  return { name, status, latencyMs: Math.round(performance.now() - started) };
};

export const checkHealth = async () => {
  const checks = [await timed("database", pingDatabase)];

  return { status: checks.every((check) => check.status === "ok") ? ("ok" as const) : ("error" as const), checks };
};
