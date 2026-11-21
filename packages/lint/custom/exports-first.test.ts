import { describe, it } from "node:test";
import { RuleTester } from "oxlint/plugins-dev";

import { exportsFirst } from "./exports-first.ts";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });

ruleTester.run("exports-first", exportsFirst, {
  valid: [
    "export const a = 1;\nconst b = 2;\nexport function c() { return b; }\nfunction d() {}",
    "export function a() { return helper(); }\nfunction helper() { return 1; }",
    "const part = { a: 1 };\nexport const schema = { part };",
    "const LIMIT = 3;\nexport const limits = read();\nfunction read() { return LIMIT; }",
    "class Cache {}\nexport const cache = new Cache();",
    "export const top = 1;\nconst filters = { top };",
    "const SUBCOMMANDS = { add };\nexport function handle() { return SUBCOMMANDS; }\nfunction add() {}",
    "function a() {}\nexport { a };",
    "type Props = { name: string };\nexport function a(props: Props) { return props; }",
    "const config = { a: 1 };\nexport default config;",
    "export const a = 1;\nconsole.log(a);"
  ],
  invalid: [
    {
      code: "function helper() { return 1; }\nexport function a() { return helper(); }",
      errors: [{ messageId: "moveBelowExports", data: { name: "helper", group: "functions" } }]
    },
    {
      code: "export function a() { return LIMIT; }\nconst LIMIT = 3;",
      errors: [{ messageId: "moveAboveFunctions", data: { name: "LIMIT" } }]
    },
    {
      code: "function read() { return 1; }\nexport const value = read();",
      errors: [{ messageId: "moveAboveFunctions", data: { name: "value" } }]
    },
    {
      code: "const LIMIT = 3;\nexport const a = 1;",
      errors: [{ messageId: "moveBelowExports", data: { name: "LIMIT", group: "values" } }]
    },
    {
      code: "const variants = { a: 1 };\nexport const sizes = { b: 2 };\nexport type Variant = keyof typeof variants;",
      errors: [{ messageId: "moveBelowExports", data: { name: "variants", group: "values" } }]
    },
    {
      code: "const { a, b } = load();\nexport const c = 1;\nfunction load() { return { a: 1, b: 2 }; }",
      errors: [{ messageId: "moveBelowExports", data: { name: "a, b", group: "values" } }]
    },
    {
      code: "export function a() {}\nexport default defineConfig({});",
      errors: [{ messageId: "moveAboveFunctions", data: { name: "default" } }]
    }
  ]
});
