// @ts-check
const eslint = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const angularEslint = require("@angular-eslint/eslint-plugin");
const angularTemplateParser = require("@angular-eslint/template-parser");
const angularTemplatePlugin = require("@angular-eslint/eslint-plugin-template");

module.exports = [
    // TypeScript files
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "@angular-eslint": angularEslint,
        },
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case",
                },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
    // HTML template files
    {
        files: ["**/*.html"],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            "@angular-eslint/template": angularTemplatePlugin,
        },
        rules: {},
    },
    // Ignore patterns
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            ".angular/**",
            "coverage/**",
            "*.config.js",
            "*.config.mjs",
            ".husky/**",
        ],
    },
];
