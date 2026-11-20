import { exportsFirst } from "./custom/exports-first.js";
import { objectFunctionTypes } from "./custom/object-function-types.js";
import { routeComponentName } from "./custom/route-component-name.js";
import { typeAboveFirstUse } from "./custom/type-above-first-use.js";

export default {
  meta: {
    name: "sanity"
  },
  rules: {
    "exports-first": exportsFirst,
    "object-function-types": objectFunctionTypes,
    "route-component-name": routeComponentName,
    "type-above-first-use": typeAboveFirstUse
  }
};
