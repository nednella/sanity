import { describe, it } from "node:test";
import { RuleTester } from "oxlint/plugins-dev";

import { typeAboveFirstUse } from "./type-above-first-use.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });

ruleTester.run("type-above-first-use", typeAboveFirstUse, {
  valid: [
    "type Props = { name: string };\nexport function a(props: Props) { return props; }",
    "type Row = { id: number };\ntype Props = { rows: Row[] };\nexport function a(props: Props) { return props; }",
    "type A = { a: number };\ntype B = { b: number };\nexport function c(a: A, b: B) { return [a, b]; }",
    "type Unused = { a: number };\nexport const b = 1;",
    "export type Shared = { a: number };\nexport function a() {}\nexport function b(shared: Shared) { return shared; }"
  ],
  invalid: [
    {
      code: "type Props = { name: string };\nexport function a() {}\nexport function b(props: Props) { return props; }",
      errors: [{ messageId: "moveAboveFirstUse", data: { name: "Props", line: 3 } }]
    },
    {
      code: "export function a(props: Props) { return props; }\ntype Props = { name: string };",
      errors: [{ messageId: "moveAboveFirstUse", data: { name: "Props", line: 1 } }]
    },
    {
      code: "interface Props { name: string }\nconst x = 1;\nexport function a(props: Props) { return [props, x]; }",
      errors: [{ messageId: "moveAboveFirstUse", data: { name: "Props", line: 3 } }]
    }
  ]
});
