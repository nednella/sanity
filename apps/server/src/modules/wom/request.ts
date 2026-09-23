import { z } from "zod";

// Old School names are at most 12 characters
export const womPlayerParams = z.object({ username: z.string().trim().min(1).max(12) });
