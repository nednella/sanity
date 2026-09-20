import { eq } from "drizzle-orm";

import { members } from "@db/schema";

export const isActive = (active: boolean | undefined) =>
  active === undefined ? undefined : eq(members.isActive, active);
