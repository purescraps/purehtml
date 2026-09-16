import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

type Segment = { type: 'key'; key: string } | { type: 'index'; index: number };

const isIdentChar = (ch: string) => /[A-Za-z0-9_]/.test(ch);

function parseJsonPath(path: string): Segment[] {
  if (path.length === 0 || path[0] !== '$') {
    throw new Error(
      `jsonpath: invalid path ${JSON.stringify(path)}: must start with "$"`,
    );
  }

  const segments: Segment[] = [];
  const n = path.length;
  let i = 1;

  while (i < n) {
    const ch = path[i];

    if (ch === '.') {
      i += 1;
      const start = i;
      while (i < n && isIdentChar(path[i])) {
        i += 1;
      }
      if (i === start) {
        throw new Error(
          `jsonpath: invalid path ${JSON.stringify(path)}: expected a name after "."`,
        );
      }
      segments.push({ type: 'key', key: path.slice(start, i) });
      continue;
    }

    if (ch === '[') {
      i += 1;
      if (i >= n) {
        throw new Error(
          `jsonpath: invalid path ${JSON.stringify(path)}: unterminated "["`,
        );
      }

      const next = path[i];
      if (next === '"' || next === "'") {
        const quote = next;
        i += 1;
        let key = '';
        while (i < n && path[i] !== quote) {
          if (
            path[i] === '\\' &&
            i + 1 < n &&
            (path[i + 1] === quote || path[i + 1] === '\\')
          ) {
            key += path[i + 1];
            i += 2;
          } else {
            key += path[i];
            i += 1;
          }
        }
        if (i >= n) {
          throw new Error(
            `jsonpath: invalid path ${JSON.stringify(path)}: unterminated quoted key`,
          );
        }
        i += 1; // skip closing quote
        segments.push({ type: 'key', key });
      } else if (next === '-' || (next >= '0' && next <= '9')) {
        const start = i;
        if (next === '-') {
          i += 1;
        }
        const digitsStart = i;
        while (i < n && path[i] >= '0' && path[i] <= '9') {
          i += 1;
        }
        if (i === digitsStart) {
          throw new Error(
            `jsonpath: invalid path ${JSON.stringify(path)}: expected an index inside "[]"`,
          );
        }
        segments.push({
          type: 'index',
          index: parseInt(path.slice(start, i), 10),
        });
      } else {
        throw new Error(
          `jsonpath: invalid path ${JSON.stringify(path)}: expected an index or quoted key inside "[]"`,
        );
      }

      if (path[i] !== ']') {
        throw new Error(
          `jsonpath: invalid path ${JSON.stringify(path)}: expected "]"`,
        );
      }
      i += 1;
      continue;
    }

    throw new Error(
      `jsonpath: invalid path ${JSON.stringify(path)}: unexpected character "${ch}" at position ${i}`,
    );
  }

  return segments;
}

function evaluateJsonPath(root: unknown, segments: Segment[]): unknown {
  let current: unknown = root;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return null;
    }

    if (segment.type === 'key') {
      if (typeof current !== 'object' || Array.isArray(current)) {
        return null;
      }
      current = (current as Record<string, unknown>)[segment.key];
    } else {
      if (!Array.isArray(current)) {
        return null;
      }
      const index =
        segment.index < 0 ? current.length + segment.index : segment.index;
      current = index >= 0 && index < current.length ? current[index] : undefined;
    }
  }

  return current === undefined ? null : current;
}

/**
 * jsonpath: Extract a value from a parsed JSON value by path
 *
 * Usage:
 * jsonpath(path): navigates a JSON value (typically the output of `json`)
 * using dot notation for object keys (`$.a.b`) and bracket notation for
 * array indices or keys with special characters (`$.a[0]`, `$["a-b"]`).
 * Negative indices count from the end of the array. Returns null when the
 * path does not resolve to a value.
 */
export default class JSONPathTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'jsonpath';
  }

  inputType(): typeof STRING {
    return STRING;
  }

  outputType(): typeof STRING {
    return STRING;
  }

  transform({ val }: TransformParams): unknown {
    if (val === null || val === undefined) {
      return null;
    }

    const [path] = this.args;
    if (path === undefined) {
      throw new Error('jsonpath: requires a path, e.g. jsonpath("$.a.b")');
    }

    return evaluateJsonPath(val, parseJsonPath(path));
  }
}
