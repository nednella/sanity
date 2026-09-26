import { count } from "drizzle-orm";

import { db } from "@db/index";
import { submissions } from "@db/schema";

import type { SubmissionFilters } from "./list-submissions";
import { matchesSubmission } from "./list-submissions";

export const countSubmissions = async (filters: SubmissionFilters) => {
  const [row] = await db.select({ value: count() }).from(submissions).where(matchesSubmission(filters));
  return row?.value ?? 0;
};
