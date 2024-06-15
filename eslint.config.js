import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tsEslint from "typescript-eslint";

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    ...tsEslint.configs.recommended,
    ...eslintPluginSvelte.configs["flat/recommended"],
    eslintConfigPrettier,
    ...eslintPluginSvelte.configs["flat/prettier"],
    {
        files: ["**/*.svelte"],
        languageOptions: {
            globals: {...globals.browser},
            parser: svelteParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".svelte"],
            },
        },
    },
    eslintPluginPrettierRecommended
];

