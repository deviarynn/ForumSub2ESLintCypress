module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx'] }],
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': 'off',
    'react/function-component-definition': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // Redux Toolkit slice reducers
          'acc',   // reduce accumulators
          'e',     // event objects
        ],
      },
    ],
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  },
  overrides: [
    {
      files: ['src/tests/**/*.test.{js,jsx}', 'src/**/*.test.{js,jsx}'],
      env: { 'vitest-globals/env': true },
      plugins: ['vitest-globals'],
      extends: ['plugin:vitest-globals/recommended'],
    },
  ],
};
