import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      // For coverage reports 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      statements: 95
    }
  }
});
