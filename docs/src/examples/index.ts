import { advanced } from './advanced';
import { basic } from './basic';
import type { Example } from './example';
export type { Example } from './example';

export interface SelectItem {
  value: string;
  label: string;
}

export function exampleToComboboxItem(example: Example): SelectItem {
  return {
    value: example.name,
    label: example.name,
  };
}

function findByName(name: string | null): Example | null {
  return (
    basic.find((e) => e.name === name) ??
    advanced.find((e) => e.name === name) ??
    null
  );
}

export const examples = { advanced, basic, findByName };
