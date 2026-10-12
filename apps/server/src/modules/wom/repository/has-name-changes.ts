import { db } from "@db/index";
import { womNameChanges } from "@db/schema";

export const hasNameChanges = async () => {
  const [row] = await db.select({ id: womNameChanges.id }).from(womNameChanges).limit(1);

  return row !== undefined;
};
