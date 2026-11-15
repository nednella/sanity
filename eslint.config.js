import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImportX from "eslint-plugin-import-x";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist", "apps/web/src/routeTree.gen.ts", "packages/api/src/v1.d.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      eslintPluginUnicorn.configs.recommended,
      eslintConfigPrettier // must be last
    ],
    plugins: {
      "@stylistic": stylistic,
      import: eslintPluginImportX
    },
    languageOptions: {
      globals: globals.node
    },
    rules: {
      // allow idiomatic TS and server names
      // see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/name-replacements.md
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
            res: true,
            Application: true,
            application: true
          }
        }
      ],

      // see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
      "unicorn/no-null": "off",

      // TypeScript already errors on unresolved imports
      // see: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md#when-not-to-use-it
      "import/no-unresolved": "off",

      // disable default exporting
      // see: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-default-export.md
      "import/no-default-export": "error",

      // one import per module, types inline
      // see: https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
      "import/no-duplicates": ["error", { "prefer-inline": true }],

      // named functions are declarations, arrows only for anonymous ones
      // see: https://eslint.org/docs/latest/rules/func-style
      "func-style": ["error", "declaration"],

      // code matches the Prettier print width, comments wrap at 80
      // see: https://eslint.style/rules/max-len
      "@stylistic/max-len": [
        "error",
        {
          code: 120,
          comments: 80,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],

      // a space after the comment marker
      // see: https://eslint.style/rules/spaced-comment
      "@stylistic/spaced-comment": ["error", "always"]
    }
  },
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    extends: [eslintPluginReactHooks.configs.flat.recommended, eslintPluginReactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // an element with no children closes itself
      // see: https://eslint.style/rules/jsx-self-closing-comp
      "@stylistic/jsx-self-closing-comp": "error",

      // no braces around a plain string prop or child
      // see: https://eslint.style/rules/jsx-curly-brace-presence
      "@stylistic/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }]
    }
  },
  {
    files: ["apps/web/src/routes/**/*.tsx"],
    rules: {
      // the router plugin splits route components into their own modules, which
      // handle fast refresh
      // see: https://tanstack.com/router/latest/docs/framework/react/guide/automatic-code-splitting
      "react-refresh/only-export-components": "off",

      // see: https://eslint.org/docs/latest/rules/no-restricted-syntax
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "VariableDeclarator[id.name='Route'] > CallExpression > ObjectExpression > Property[key.name='component']:not([value.name=/^(Page|Layout)$/])",
          message: "Name the route component Page or Layout."
        }
      ]
    }
  },
  {
    files: ["**/*.config.ts"],
    rules: {
      // tooling configs require a default export
      "import/no-default-export": "off"
    }
  }
]);
