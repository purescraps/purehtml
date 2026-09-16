### UNRELEASED

**BREAKING CHANGE (Go):**

- **go**: `ConfigFactory.FromYAML` now validates configs against the shared config schema and returns a `*purehtml.ValidationError` for invalid input. Configs the schema rejects but Go previously accepted (e.g. `type: object` without `properties`) now fail, matching the other ports.

- feat(go): add config schema validation, embedding a copy of `config-schema.json` that a test keeps in sync with the TypeScript copy
- feat: support a per-field `default` config option, returning the configured fallback value instead of `null` when a selector (or every union member) matches nothing
- feat: support `type: number` and `type: boolean` on primitive values, coercing the extracted (and optionally transformed) value without requiring an explicit `number`/`boolean` transformer

### 0.9.0

- feat: add string transformers (boolean, capitalize, join, lower, replace, split, upper)
- feat(typescript): use bun test
- fix: resolve TypeScript errors after upgrading to node16 module resolution
- feat: added removeLastPathSection transformer
- deps: upgrade typescript dependencies

### 0.8.0

**BREAKING CHANGE:**

- **removeUrlQueryParam**: remove all the search parameters if no arguments are given

### 0.7.0

- Added support for array configurations inside `union` config.

### 0.6.0

- Added the `removeUrlQueryParam` transformer, along with its test specifications

### 0.5.0

- Added the `json` transformer
