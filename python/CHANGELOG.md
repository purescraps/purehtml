### UNRELEASED

### 0.2.0

- feat: add an optional selectolax (Lexbor) backend, benchmarked alongside BeautifulSoup
- fix: root objects with no selector search the whole document instead of crashing
- fix: union configs with array sub-configs, `includeRoot` handling in selector configs, and number transformer support for integers and floats, aligned with the shared spec
- chore: add repository information to package metadata

### 0.1.5

- feat: add `type: number` and `type: boolean` on primitive values, coercing the final result
- feat: add a per-field `default` option returned when a selector (or every union member) matches nothing
- feat: add a `jsonpath` transformer
- feat: add string transformers (boolean, capitalize, join, lower, replace, split, upper)
- feat: add `json`, `removeLastPathSection` and `removeUrlQueryParam` transformers
- docs: document fallback selectors and transformer argument quoting rules
- chore: add skip-existing to the publish workflow

### 0.1.4

- fix: correct type annotations

### 0.1.2+1

- fix: return nothing when no matches are found
- docs: fix the package name in the readme

### 0.1.2

- build: version bump

### 0.1.1

- Initial Python implementation
