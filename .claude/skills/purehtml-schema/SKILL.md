---
name: purehtml-schema
description: Build a PureHTML extraction schema (YAML) from an HTML page, either for a list of properties the user names (e.g. "title, price, image, rating") or for a page type the user names (e.g. "product page", "article", "search results", "job listing"). Use when the user gives an HTML file, snippet, or saved page and wants a purehtml/extract.yaml config that turns it into JSON. The skill writes the schema, runs it against the HTML, and iterates until the output is right.
---

# Build a PureHTML schema from HTML

Goal: produce a YAML schema that, run through `extract()`, returns the JSON the user asked for from **their** HTML. A schema is only done once it has been run against the HTML and the output checked.

## Inputs

- **HTML**: a file path, a pasted snippet (save it to the scratchpad), or a saved page. If the user gives only a URL, ask for the saved HTML. Pages rendered by JavaScript look different when fetched raw.
- **Target**: either
  - **explicit properties**: use exactly the names the user gave, in camelCase unless they wrote them another way, or
  - **a page type**: pick the fields from the matching preset below, and keep only the fields the HTML actually has.
- **Base URL** (optional): `resolve` uses it to make links absolute. Ask for it only when the page has relative links and the user cares about absolute URLs; otherwise use the page's `<link rel="canonical">` or `<base href>` if there is one.

## Workflow

1. **Survey the HTML before choosing selectors.** Large pages: use `grep`/`rg` on the file, not a full read. Check these, in order of preference:
   1. Structured data: `script[type="application/ld+json"]`, `script#__NEXT_DATA__`, `script#__NUXT_DATA__`, other `type="application/json"` scripts. When the fields are there, `json` + `jsonpath` survives page redesigns far better than CSS classes do.
   2. Semantic hooks: `id`, `itemprop`, `data-*` attributes (`data-testid`, `data-price`), `<meta property="og:*">`, `<time datetime>`, ARIA labels.
   3. Stable-looking class names (`.product-title`, `.price`).
   4. Structural selectors (`h1`, `article > header p`). Use these only when nothing above is available.

   Avoid hashed or utility classes (`.css-1x2y3z`, `.sc-abc123`, `.mt-4.flex`) and positional selectors such as `:nth-child(7)` unless nothing else works.
2. **Find the repeating unit** for lists (cards, rows, `li`s). Make it the array `selector` and write item properties *relative to it*.
3. **Write the schema** to a `.yaml` file: wherever the user asks, or in the scratchpad if they don't say.
4. **Run it**:
   ```bash
   bun .claude/skills/purehtml-schema/scripts/extract.ts <schema.yaml> <page.html> [baseUrl]
   ```
   (The path is relative to the repo root; the script works from any working directory.) It validates the schema with the real TypeScript port and prints the JSON result, or `SCHEMA INVALID: …`.
5. **Check every field** against the HTML: no `null` where the page has a value, no leftover whitespace or currency symbols in numbers, correct item count in arrays, links absolute when expected. Fix the schema and run it again until the output is right.
6. **Deliver** the schema plus a sample of the output JSON. Mention any field you couldn't find in the HTML, and any selector you consider fragile.

## Schema reference

The authoritative JSON Schema is `typescript/src/config-schema.json`. Docs live in `docs/content/docs/` (`basics`, `objects`, `arrays`, `union-config`, `constant-config`, `transformers/*`).

Node kinds (each node is exactly one):

```yaml
# primitive: inner text of the FIRST match (in document order)
selector: .price
transform: [trim, number]        # optional pipeline
type: number                     # optional: number|boolean is sugar for appending that transformer
default: 0                       # optional: used when the selector matches nothing

# object: `type: object` is implied by `properties`
selector: .card                  # optional: scopes the children; omit to use the current element
properties:
  name: { selector: h2, transform: trim }

# array: `type: array` is implied by `items`
selector: .card                  # every match becomes one item
items:
  properties: { ... }            # or `items: {}` for the text of each match
# NOTE: a `transform` on the array node itself (e.g. join, length) is currently
# ignored when `items` is set, and rejected without `items`. Don't rely on it;
# return the array and let the consumer join it.

# union: the first branch whose SELECTOR MATCHES wins, even if its transforms yield null
union:
  - { selector: .sale-price, transform: [trim, number] }
  - { selector: .price, transform: [trim, number] }
  - { constant: null }

# constant
constant: USD
```

Rules that are easy to get wrong:

- **Always write property values as objects.** `title: { selector: h1 }` is valid. The shorthand `title: h1` is **rejected** by the validator, even though one docs page shows it.
- **Objects can't have `transform`.** Put transforms on the leaf properties.
- **A property without `selector`** reads from the scope element itself. Use this for attributes of an array item: `id: { transform: attr(data-id) }`.
- **Sibling selectors work relative to the scope element.** `+tr span.score` reaches into the next sibling row (see the Hacker News example in `README.md`). `~ .x` works too.
- **`selector: [a, b]` is NOT a priority list.** In the TS port the selectors are joined into `a, b`, so the match that comes first *in the document* wins. When order matters (for example, sale price before regular price), use `union` instead.
- **Use `default` or a trailing `constant` in a union** for optional fields, so the output shape stays stable.
- **Don't put `default` on a union branch.** A branch with `default` is always taken, so later branches never run. Put `default` on the union itself, or end with a `constant` branch.
- **`default` only replaces `null`.** An element that exists but is empty gives `""`, not the default.
- **`resolve` throws on a missing link**, and `default` doesn't help. For optional links, use a union: `union: [{ selector: a.next, transform: [attr(href), resolve] }, { constant: null }]`. Select `a.next[href]` if the attribute itself may be missing.
- **Use `exists`** for flags such as "in stock" or "has badge": `{ selector: .sold-out, transform: exists }`.
- Text is the element's text content. To keep markup, use `html`.

## Transformers

Chain them as a list. Each one receives the previous one's output.

| Transformer | Use |
|---|---|
| `trim` | strip surrounding whitespace (add it to almost every text field) |
| `number` | parse to a number; strip symbols and thousands separators with `replace` first |
| `boolean` | truthy cast of the value |
| `exists` | `true` if the selector matched |
| `attr(name)` / `attr` / `attr(a, b)` | one attribute / all attributes as an object / a subset |
| `html` | innerHTML |
| `replace(pattern, repl)` | regex/literal replace-all |
| `split` / `split(",")` | split on whitespace / on a delimiter |
| `join` / `join(", ")` | join an array, e.g. after `split` or `jsonpath` (array-node transforms don't apply; see above) |
| `json` | parse text as JSON |
| `jsonpath("$.a.b")` | pluck from parsed JSON (put it after `json`) |
| `resolve` | make a URL absolute against the base URL |
| `urlQueryParam(q)` / `urlQueryParam` | one query param / all of them as an object |
| `removeUrlQueryParam(a, b)` | strip tracking params |
| `removeLastPathSection` | drop the last URL path segment |
| `length` | length of a string or array (throws on objects) |
| `lower` / `upper` / `capitalize` | change case |

**Argument quoting:** bare args must match `[\w-]+` (`attr(data-id)`, `replace(-, _)`). Anything containing spaces, commas, colons, `$`, `.`, or regex metacharacters must be in double or single quotes. Inside quotes, `\"`, `\'`, and `\\` are escapes, and regex escapes like `\s` and `\d` pass through unchanged. In YAML, wrap the whole expression in single quotes:

```yaml
transform:
  - trim
  - 'replace("[^\d.]", "")'   # "$1,299.00" -> "1299.00"
  - number
```

Price cleanup pattern: `'replace("[^\d.]", "")'` then `number`. For European formats (`1.299,00 €`), first `'replace("[^\d,]", "")'`, then `'replace(",", ".")'`, then `number`.

## Page-type presets

Use these as the starting field set when the user names a page type. Drop fields the page lacks, and add obvious extras the page clearly has.

- **product**: `name`, `price` (number), `currency`, `originalPrice`, `inStock` (boolean), `sku`, `brand`, `images` (array of absolute URLs), `rating` (number), `reviewCount` (number), `description`, `url`. Check JSON-LD `@type: Product` first.
- **product listing / search results**: an array of `{ name, price, url, image, rating }`, plus `nextPageUrl` and `totalResults` when present. The root is then an object holding `items` and the pagination fields.
- **article / blog post**: `title`, `author`, `publishedAt` (from `time[datetime]` or `article:published_time`), `updatedAt`, `tags` (array), `image`, `body` (`html` or text), `url`.
- **news / link listing** (HN-style): an array of `{ id, title, url, score, author, commentsCount, commentsUrl, date }`.
- **job posting**: `title`, `company`, `location`, `employmentType`, `salary`, `postedAt`, `description`, `applyUrl`. Check JSON-LD `JobPosting` first.
- **recipe**: `name`, `ingredients` (array), `steps` (array), `prepTime`, `cookTime`, `servings`, `image`. Check JSON-LD `Recipe` first.
- **profile / company page**: `name`, `headline`, `location`, `avatar`, `links` (array), `stats`.
- **SEO / meta**: `title` (`title` tag), `description` (`meta[name=description]` + `attr(content)`), `canonical`, `ogTitle`, `ogImage`, `jsonLd` (`json`).

For a type not listed here, choose the fields a scraper of that page would plausibly want, and list them in your reply so the user can adjust.

## Output conventions

- Put a `# yaml-language-server: $schema=…/typescript/src/config-schema.json` modeline at the top of schema files saved inside the repo.
- Prefer flow style (`{ selector: h1, transform: trim }`) for short leaves and block style for nested objects and arrays.
- If the user wants the schema as a regression test, add a case to the matching `specs/*.yaml` file (format: `spec.schema.yaml`, with `description`, `configuration`, `input`, `expected`). That runs it in all language ports.
