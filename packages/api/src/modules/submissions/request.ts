import { z } from "zod";

import { bigIntString } from "../../codecs.js";
import { event } from "./response.js";

export const submissionFilters = z.object({
  memberId: bigIntString.optional(),
  event: event.optional()
});
