import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'react/react-in-jsx-scope': 'off', // Disables the need for 'React' in JSX scope
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_' },
      ], // Allow `_var` for unused variables
      '@typescript-eslint/no-explicit-any': 'off', // Allows usage of 'any' type'
      'no-undef': 'off', // Disables the 'React is not defined' error
      // '@typescript-eslint/no-implicit-any-catch': 'off', // Allows usage of 'any' type
    },
  },
];
