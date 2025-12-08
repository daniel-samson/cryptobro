import { defineConfig } from 'vitest/config';
import angular from '@angular/build/config';

export default defineConfig({
  ...angular.getAngularCompilerPlugin(),
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.ts',
        'src/test.ts',
        '**/*.spec.ts',
      ]
    }
  }
});
