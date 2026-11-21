import { definePlugin } from "@oxlint/plugins";

import { exportsFirst } from "./exports-first.ts";
import { objectFunctionTypes } from "./object-function-types.ts";
import { routeComponentName } from "./route-component-name.ts";
import { typeAboveFirstUse } from "./type-above-first-use.ts";

export default definePlugin({
  meta: {
    name: "custom"
  },
  rules: {
    "exports-first": exportsFirst,
    "object-function-types": objectFunctionTypes,
    "route-component-name": routeComponentName,
    "type-above-first-use": typeAboveFirstUse
  }
});
