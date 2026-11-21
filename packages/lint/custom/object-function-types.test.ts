import { describe, it } from "node:test";
import { RuleTester } from "oxlint/plugins-dev";

import { objectFunctionTypes } from "./object-function-types.ts";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });

ruleTester.run("object-function-types", objectFunctionTypes, {
  valid: [
    "type Handler = { (name: string): void };",
    "type Props = { onClick: () => void };",
    "function run(callback: () => void) { callback(); }"
  ],
  invalid: [
    {
      code: "type Handler = (name: string) => void;",
      errors: [{ messageId: "useCallSignature" }]
    }
  ]
});
