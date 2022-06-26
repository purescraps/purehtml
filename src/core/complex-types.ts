export const OBJECT: unique symbol = Symbol('OBJECT');
export const ARRAY: unique symbol = Symbol('ARRAY');

export type ComplexTypes = typeof OBJECT | typeof ARRAY;
