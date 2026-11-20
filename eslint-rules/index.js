import { exportsFirst } from "./exports-first.js";
import { objectFunctionTypes } from "./object-function-types.js";
import { routeComponentName } from "./route-component-name.js";
import { typeAboveFirstUse } from "./type-above-first-use.js";

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
