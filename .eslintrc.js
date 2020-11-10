module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-syntax': 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'no-undef': 'off',
  },
};
