import { describe, it } from "node:test";
import { RuleTester } from "oxlint/plugins-dev";

import { routeComponentName } from "./route-component-name.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { parserOptions: { lang: "tsx" } } });

ruleTester.run("route-component-name", routeComponentName, {
  valid: [
    'export const Route = createFileRoute("/")({ component: Page });',
    'export const Route = createFileRoute("/")({ component: Layout });',
    "const options = { component: Members };"
  ],
  invalid: [
    {
      code: 'export const Route = createFileRoute("/")({ component: Members });',
      errors: [{ messageId: "renameComponent" }]
    }
  ]
});
