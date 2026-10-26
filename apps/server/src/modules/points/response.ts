import { z } from "zod";

export const awardedPoints = z.object({ awarded: z.number() });
