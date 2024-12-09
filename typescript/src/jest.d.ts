declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
  interface Matchers<R, T = {}> {
    toBeValidConfig(): void;
  }
}
