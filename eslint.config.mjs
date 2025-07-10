/**  import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([*/
  //{ files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  //{ files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
 /* tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]); */






import { defineConfig, FlatCompat } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default defineConfig([
  { root: true }, 
  { ignores: ['**/node_modules/**', 'dist/**'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    ...tseslint.configs.recommended,
    languageOptions: {
      parserOptions: { project: './tsconfig.json' }, 
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    languageOptions: { globals: globals.browser },
  },
  ...compat.config({ extends: ['next', 'next/core-web-vitals'] }),
]);

