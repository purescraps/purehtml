import type { Transformer } from '../core/transformer';
import { Transformers } from './transformers';

// A single argument is either a bare word (letters/digits/-/_) or a
// single- or double-quoted string, which may contain commas, spaces, and
// regex metacharacters that a bare word cannot.
const ARG_PATTERN = /(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\w-]+)/.source;

export const TRANSFORMER_DEFINITION_REGEX = `^[\\w-]+(\\((\\s*${ARG_PATTERN}\\s*(,\\s*${ARG_PATTERN}\\s*)*)?\\))?$`;

const TRANSFORMER_NAME_REGEX = /^([\w-]+[^(])/;

export class TransformerFactory {
  static create(transform: string): Transformer {
    const transformerName =
      TransformerFactory.extractTransformerName(transform);
    const args = TransformerFactory.extractTransformerArgs(transform);
    const TransfomerImpl = Transformers.getByName(transformerName);

    if (!TransfomerImpl) {
      throw new Error(`Transformer with name "${transformerName}" not found.`);
    }

    return new TransfomerImpl(args);
  }

  private static extractTransformerName(def: string) {
    const matches = def.match(TRANSFORMER_NAME_REGEX);

    if (matches === null) {
      throw new Error(`Invalid transformer name: ${def}`);
    }

    return matches[0];
  }

  private static extractTransformerArgs(def: string): string[] {
    const openIndex = def.indexOf('(');
    if (openIndex === -1) {
      return [];
    }

    const closeIndex = def.lastIndexOf(')');
    if (closeIndex === -1 || closeIndex < openIndex) {
      return [];
    }

    return TransformerFactory.parseArgList(
      def.slice(openIndex + 1, closeIndex),
    );
  }

  /**
   * Parses a comma-separated argument list, honoring single- and
   * double-quoted arguments so that delimiters, regex patterns, and
   * replacement strings can contain commas, spaces, and other characters
   * that would otherwise conflict with the comma separator, e.g.
   * replace("\s+", " ") or split(", "). Inside a quoted argument, a
   * backslash escapes the matching quote character or another backslash
   * (\" or \\); any other backslash (e.g. the \s above) is left untouched
   * so regex patterns pass through unchanged. Bare (unquoted) arguments are
   * trimmed of surrounding whitespace but otherwise taken verbatim.
   */
  private static parseArgList(argsStr: string): string[] {
    const args: string[] = [];
    let i = 0;
    const n = argsStr.length;

    const isSpace = (ch: string) => ch === ' ' || ch === '\t' || ch === '\n';

    while (i < n) {
      while (i < n && isSpace(argsStr.charAt(i))) {
        i += 1;
      }
      if (i >= n) {
        break;
      }

      const ch = argsStr.charAt(i);
      if (ch === '"' || ch === "'") {
        const quote = ch;
        i += 1;
        let value = '';
        while (i < n && argsStr.charAt(i) !== quote) {
          const c = argsStr.charAt(i);
          const next = argsStr.charAt(i + 1);
          if (c === '\\' && i + 1 < n && (next === quote || next === '\\')) {
            value += next;
            i += 2;
          } else {
            value += c;
            i += 1;
          }
        }
        i += 1; // skip closing quote
        args.push(value);
      } else {
        const start = i;
        while (i < n && argsStr.charAt(i) !== ',') {
          i += 1;
        }
        args.push(argsStr.slice(start, i).trim());
      }

      while (i < n && isSpace(argsStr.charAt(i))) {
        i += 1;
      }
      if (i < n && argsStr.charAt(i) === ',') {
        i += 1;
      }
    }

    return args;
  }
}
