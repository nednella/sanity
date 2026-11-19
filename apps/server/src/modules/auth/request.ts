import { z } from "zod";

export const apiKeyParams = z.object({ id: z.coerce.number().int().positive() });

// Discord sends `error` instead of `code` when the user cancels.
export const discordCallbackQuery = z.object({
  code: z.string().optional(),
  state: z.string().optional()
});
