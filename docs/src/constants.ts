export const basePath =
  // in production we publish docs on https://purescraps.github.io/purehtml
  // this is why we set base path to /purehtml
  process.env.NODE_ENV === 'production' ? '/purehtml' : '/';
