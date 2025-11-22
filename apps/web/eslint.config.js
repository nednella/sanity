import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginImport from "eslint-plugin-import"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            eslintPluginUnicorn.configs.recommended,
            eslintPluginImport.flatConfigs.recommended,
            eslintPluginImport.flatConfigs.typescript,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            eslintConfigPrettier // must be last
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        },
        settings: {
            react: {
                version: "detect"
            },
            "import/resolver": {
                typescript: true
            }
        },
        rules: {
            "unicorn/prevent-abbreviations": [
                "error",
                {
                    allowList: {
                        Props: true,
                        props: true,
                        Env: true,
                        env: true,
                        Utils: true,
                        utils: true
                    }
                }
            ],
            "import/no-unresolved": "off", // does not support Vite natively, see: https://github.com/import-js/eslint-plugin-import/blob/v2.32.0/docs/rules/no-unresolved.md#when-not-to-use-it\
            "import/no-default-export": "error" // disable default exporting
        }
    }
])
