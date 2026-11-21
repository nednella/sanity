import { definePlugin } from "@oxlint/plugins";

import custom from "./custom/index.ts";

export default definePlugin({
  meta: {
    name: "sanity"
  },
  rules: {
    ...custom.rules
  }
});
