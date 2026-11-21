import { pingDatabase } from "@/modules/health/repository/ping-database";

export async function checkHealth() {
  const checks = [await runCheck("database", pingDatabase)];

  return { status: checks.every((check) => check.status === "ok") ? ("ok" as const) : ("error" as const), checks };
}

async function runCheck(name: string, run: () => Promise<void>) {
  const started = performance.now();
  let status: "error" | "ok" = "ok";
  try {
    await run();
  } catch {
    status = "error";
  }

  return { name, status, latencyMs: Math.round(performance.now() - started) };
}
