module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    // Vue
    'vue/multi-word-component-names': 'off',

    // JavaScript
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Let Prettier handle formatting
    'prettier/prettier': 'off',
  },
}
