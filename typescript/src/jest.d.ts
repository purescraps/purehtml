declare namespace jest {
  // biome-ignore lint/complexity/noBannedTypes: this is just from jest types themselves
  // biome-ignore lint/correctness/noUnusedVariables: this is just from jest types themselves
  interface Matchers<R, T = {}> {
    toBeValidConfig(): void;
  }
}
