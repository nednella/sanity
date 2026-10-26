import { z } from "zod";

export const apiKeyParams = z.object({ id: z.coerce.number().int().positive() });
