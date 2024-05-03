module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'handle-callback-err': 1,
    'no-unused-vars': 0,
    'no-empty-pattern': 0,
  },
  ignorePatterns: ['es6/', 'dist/', '.eslintrc.js', '*.spec.ts', 'vitest.config.js'],

  // Parsers for different files (Adapted from @react-native)
  overrides: [
    {
      files: ['*.js'],
      parser: '@babel/eslint-parser',
    },
    {
      files: ['*.jsx'],
      parser: '@babel/eslint-parser',
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: true,
        tsconfigRootDir: __dirname,
      },
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/no-floating-promises': 2,
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
      },
    },
  ],

  // Copied from React native
  globals: {
    __DEV__: true,
    __dirname: false,
    __fbBatchedBridgeConfig: false,
    AbortController: false,
    Blob: true,
    alert: false,
    cancelAnimationFrame: false,
    cancelIdleCallback: false,
    clearImmediate: true,
    clearInterval: false,
    clearTimeout: false,
    console: false,
    document: false,
    ErrorUtils: false,
    escape: false,
    Event: false,
    EventTarget: false,
    exports: false,
    fetch: false,
    File: true,
    FileReader: false,
    FormData: false,
    global: false,
    Headers: false,
    Intl: false,
    Map: true,
    module: false,
    navigator: false,
    process: false,
    Promise: true,
    requestAnimationFrame: true,
    requestIdleCallback: true,
    require: false,
    Set: true,
    setImmediate: true,
    setInterval: false,
    setTimeout: false,
    queueMicrotask: true,
    URL: false,
    URLSearchParams: false,
    WebSocketMessageEvent: true,
    window: false,
    XMLHttpRequest: false,

    // for @bhoos/serialization
    Buffer: true,
  },
};
