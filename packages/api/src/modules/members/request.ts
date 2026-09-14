import { z } from "zod";

import { bigIntString, booleanString } from "../../codecs.js";
import { top } from "../personal-bests/request.js";

export const memberParams = z.object({ id: bigIntString });

export const memberFilters = z.object({ active: booleanString.default(true) });

export const memberPersonalBestFilters = z.object({ top: top.optional() });
