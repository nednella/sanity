import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImportX from "eslint-plugin-import-x";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist", "apps/web/src/routeTree.gen.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      eslintPluginUnicorn.configs.recommended,
      eslintConfigPrettier // must be last
    ],
    plugins: {
      import: eslintPluginImportX
    },
    languageOptions: {
      globals: globals.node
    },
    rules: {
      // allow idiomatic TS and server names, see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/name-replacements.md
      "unicorn/name-replacements": [
        "error",
        {
          allowList: {
            Props: true,
            props: true,
            Env: true,
            env: true,
            Utils: true,
            utils: true,
            Ref: true,
            ref: true,
            Db: true,
            db: true,
            Params: true,
            params: true,
            Req: true,
            req: true,
            Res: true,
            res: true
          }
        }
      ],
      // see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
      "unicorn/no-null": "off",
      // TypeScript already errors on unresolved imports, see: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md#when-not-to-use-it
      "import/no-unresolved": "off",
      // disable default exporting, see: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-default-export.md
      "import/no-default-export": "error"
    }
  },
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    extends: [eslintPluginReactHooks.configs.flat.recommended, eslintPluginReactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ["apps/web/src/routes/**/*.tsx"],
    rules: {
      // the router plugin splits route components into their own modules, which handle fast refresh, see: https://tanstack.com/router/latest/docs/framework/react/guide/automatic-code-splitting
      "react-refresh/only-export-components": "off"
    }
  },
  {
    files: ["**/*.config.ts"],
    rules: {
      "import/no-default-export": "off" // tooling configs require a default export
    }
  }
]);
