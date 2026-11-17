import { exportsFirst } from "./exports-first.js";
import { typeAboveFirstUse } from "./type-above-first-use.js";

export const sanity = {
  rules: {
    "exports-first": exportsFirst,
    "type-above-first-use": typeAboveFirstUse
  }
};
