export const STRING: unique symbol = Symbol('STRING');
export const NUMBER: unique symbol = Symbol('NUMBER');
export const BOOLEAN: unique symbol = Symbol('BOOLEAN');

export type PrimitiveTypes = typeof STRING | typeof NUMBER | typeof BOOLEAN;
