import type { Config } from 'jest';

const config: Config = {
  setupFilesAfterEnv: [
    '<rootDir>/src/setup-jest-matchers.ts',
  ],
};

export default config;
