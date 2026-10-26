import { z } from "zod";

export const pluginKey = z.object({ key: z.string() });
