import {
  Alert,
  Badge,
  Box,
  Button,
  Code,
  Group,
  List,
  Text,
  Title,
} from '@mantine/core';
import { IconExternalLink, IconInfoCircle, IconSparkles } from '@tabler/icons-react';
import { DocsAnchor } from './DocsAnchor';
import { PureHtmlSnippet } from './PureHtmlSnippet';
import { hackernewsListing } from '../examples/advanced.hackernews-listing';

const nextJsJsonLdExample = {
  html: `<script id="__NEXT_DATA__" type="application/json">
{
  "props": {
    "pageProps": {
      "product": {
        "id": "prod_9876",
        "title": "Ergonomic Mechanical Keyboard",
        "price": 149.99,
        "inStock": true,
        "tags": ["electronics", "keyboards"]
      }
    }
  },
  "page": "/products/[id]"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Ergonomic Mechanical Keyboard",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "149.99",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
  config: `properties:
  id:
    selector: script#__NEXT_DATA__
    transform:
      - json
      - 'jsonpath("$.props.pageProps.product.id")'
  title:
    selector: script#__NEXT_DATA__
    transform:
      - json
      - 'jsonpath("$.props.pageProps.product.title")'
  price:
    selector: script#__NEXT_DATA__
    transform:
      - json
      - 'jsonpath("$.props.pageProps.product.price")'
  inStock:
    selector: script#__NEXT_DATA__
    transform:
      - json
      - 'jsonpath("$.props.pageProps.product.inStock")'
  jsonLdPrice:
    selector: 'script[type="application/ld+json"]'
    transform:
      - json
      - 'jsonpath("$.offers.price")'
      - number
`,
};

const paginationExample = {
  html: `<nav class="pagination">
  <a class="prev" href="/catalog/page-1">Previous</a>
  <span class="current">Page 2</span>
  <a class="next" href="/catalog/page-3">Next</a>
</nav>
<ul class="items">
  <li><a href="details/401">Ergonomic Keyboard</a></li>
  <li><a href="details/402">Vertical Mouse</a></li>
</ul>`,
  config: `properties:
  currentPage:
    selector: .pagination .current
    transform:
      - 'replace("Page ", "")'
      - trim
      - number
  nextPageUrl:
    selector: .pagination a.next
    transform:
      - attr(href)
      - resolve
  items:
    selector: ul.items li a
    type: array
    items:
      properties:
        name:
          transform: trim
        url:
          transform:
            - attr(href)
            - resolve
`,
  url: 'https://example.com/catalog/page-2',
};

const resilientUnionExample = {
  html: `<div class="products">
  <div class="product">
    <h3 class="name">Wireless Headphones</h3>
    <span class="sale-price">$79.99</span>
    <span class="badge">In Stock</span>
  </div>
  <div class="product">
    <h3 class="name">Bluetooth Speaker</h3>
    <span class="price">$49.99</span>
  </div>
  <div class="product">
    <h3 class="name">VIP Membership</h3>
    <span class="free-text">FREE</span>
    <span class="badge">Special</span>
  </div>
</div>`,
  config: `selector: .products .product
type: array
items:
  properties:
    name:
      selector: .name
      transform: trim
    price:
      union:
        - selector: .sale-price
          transform:
            - 'replace("\\$", "")'
            - trim
            - number
        - selector: .price
          transform:
            - 'replace("\\$", "")'
            - trim
            - number
        - selector: .free-text
          transform:
            - 'replace("FREE", "0")'
            - number
        - constant: 0
    status:
      union:
        - selector: .badge
          transform: trim
        - constant: "Standard"
`,
};

export function Recipes() {
  return (
    <Box id="recipes" mt="xl">
      <Group justify="space-between" align="center" mb="xs">
        <Title order={3}>Recipes &amp; Real-World Patterns</Title>
        <Badge variant="light" color="blue" leftSection={<IconSparkles size={14} />}>
          Production Patterns
        </Badge>
      </Group>

      <Text mb="md">
        Real-world web scraping often presents unique challenges: Single Page App (SPA)
        hydration scripts, paginated listing pages with relative URLs, and variant DOM
        structures caused by A/B testing or optional fields. PureHTML handles all of
        these scenarios cleanly and declaratively.
      </Text>

      {/* Recipe 1 */}
      <Box id="recipe-hydration-data" mt="lg">
        <Title order={4}>1. Scraping Next.js / Nuxt / JSON-LD Data</Title>
        <Text mt="xs">
          Modern web applications built with Next.js, Nuxt, Remix, and SEO-enhanced
          sites embed rich, pre-rendered structured state directly within{' '}
          <Code>&lt;script&gt;</Code> tags (such as{' '}
          <Code>script#__NEXT_DATA__</Code>, <Code>script#__NUXT_DATA__</Code>, or{' '}
          <Code>script[type=&quot;application/ld+json&quot;]</Code>).
        </Text>
        <Text mt="xs">
          Extracting from these hydration script tags directly is much faster and far
          less brittle than targeting fragile presentation classes in the rendered
          DOM. You can chain <Code>json</Code> and <Code>jsonpath</Code> to query
          the state directly:
        </Text>

        <List mt="xs" size="sm" withPadding>
          <List.Item>
            <Code>json</Code>: Parses the raw JSON string inside the script tag into
            a structured object.
          </List.Item>
          <List.Item>
            <Code>{`jsonpath("$.path")`}</Code>: Plucks the exact value using dot notation
            or bracket notation (e.g. <Code>{`$.props.pageProps.product.title`}</Code>).
          </List.Item>
        </List>

        <PureHtmlSnippet
          inputHtml={nextJsJsonLdExample.html}
          configYaml={nextJsJsonLdExample.config}
        />
      </Box>

      {/* Recipe 2 */}
      <Box id="recipe-pagination-links" mt="xl">
        <Title order={4}>2. Handling Pagination &amp; Relative Links</Title>
        <Text mt="xs">
          Web crawlers and list-detail scrapers frequently extract pagination links
          (&quot;Next Page&quot;, &quot;Previous Page&quot;) and item links. In most
          HTML documents, these links are stored as relative URLs (e.g.{' '}
          <Code>/catalog/page-3</Code> or <Code>details/401</Code>).
        </Text>
        <Text mt="xs">
          PureHTML combines <Code>attr(href)</Code> with <Code>resolve</Code> to
          automatically resolve relative links against the base URL passed to the{' '}
          <Code>extract()</Code> function:
        </Text>

        <PureHtmlSnippet
          inputHtml={paginationExample.html}
          configYaml={paginationExample.config}
          url={paginationExample.url}
        />

        <Alert
          icon={<IconInfoCircle size={16} />}
          color="blue"
          radius="md"
          mt="sm"
        >
          <Text size="sm">
            In this example, the document URL is{' '}
            <Code>https://example.com/catalog/page-2</Code>. The relative href{' '}
            <Code>/catalog/page-3</Code> resolves to{' '}
            <Code>https://example.com/catalog/page-3</Code>, while{' '}
            <Code>details/401</Code> resolves to{' '}
            <Code>https://example.com/catalog/details/401</Code>.
          </Text>
        </Alert>
      </Box>

      {/* Recipe 3 */}
      <Box id="recipe-resilient-extraction" mt="xl">
        <Title order={4}>
          3. Resilient Data Extraction: Combining Union and Default
        </Title>
        <Text mt="xs">
          Real-world web pages often exhibit variant markup due to A/B testing,
          conditional UI, or missing data:
        </Text>
        <List mt="xs" size="sm" withPadding>
          <List.Item>
            A product price might be inside <Code>.sale-price</Code>,{' '}
            <Code>.price</Code>, or marked as a <Code>.free-text</Code> badge.
          </List.Item>
          <List.Item>
            Optional badges or metadata (e.g. stock status, discount percentage) may
            be missing altogether on some items.
          </List.Item>
        </List>
        <Text mt="xs">
          PureHTML&apos;s <Code>union</Code> evaluates a sequence of configurations in
          order and returns the first one that matches. Adding a <Code>constant</Code>{' '}
          configuration as the final candidate guarantees a safe fallback/default
          value when none of the selectors match:
        </Text>

        <PureHtmlSnippet
          inputHtml={resilientUnionExample.html}
          configYaml={resilientUnionExample.config}
        />
      </Box>

      {/* Recipe 4: Hacker News Real-World Scraper */}
      <Box id="recipe-hackernews" mt="xl">
        <Group justify="space-between" align="center">
          <Title order={4}>4. Real-World Case Study: Hacker News Scraper</Title>
          <DocsAnchor href="/playground">
            <Button
              size="xs"
              variant="light"
              rightSection={<IconExternalLink size={14} />}
            >
              Open in Playground
            </Button>
          </DocsAnchor>
        </Group>

        <Text mt="xs">
          This production-ready scraper extracts submission items from Hacker News (
          <Code>news.ycombinator.com</Code>). It demonstrates multiple advanced
          patterns working together seamlessly:
        </Text>

        <List mt="xs" size="sm" withPadding>
          <List.Item>
            <strong>Sibling Row Navigation</strong>: Hacker News structures posts
            across adjacent table rows. The selector uses the CSS adjacent sibling
            combinator (<Code>+tr span.age</Code>, <Code>+tr span.score</Code>) to
            query metadata from sibling rows within each submission item.
          </List.Item>
          <List.Item>
            <strong>Attribute Extraction</strong>: Extracts item ID from{' '}
            <Code>attr(id)</Code> on the row, and exact ISO submission timestamp from{' '}
            <Code>attr(title)</Code>.
          </List.Item>
          <List.Item>
            <strong>Full Link Resolution</strong>: Uses{' '}
            <Code>[attr(href), resolve]</Code> to ensure both outbound article links
            and relative HN comment links (<Code>item?id=...</Code>) resolve to
            canonical absolute URLs.
          </List.Item>
        </List>

        <PureHtmlSnippet
          inputHtml={hackernewsListing.html}
          configYaml={hackernewsListing.config}
          url={hackernewsListing.url}
        />
      </Box>
    </Box>
  );
}
