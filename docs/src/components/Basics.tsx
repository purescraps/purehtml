import { Anchor, Box, Code, Text, Title } from '@mantine/core';
import { usePureHtml } from '../hooks/usePureHtml';
import { HtmlSnippet } from './HtmlSnippet';
import { JsonSnippet } from './JsonSnippet';
import { PureHtmlSnippet } from './PureHtmlSnippet';
import { YamlSnippet } from './YamlSnippet';

const html1 = `
<div>
  <span class="foo">Hello, PureHTML!</span>
</div>`;

const yaml1 = `selector: .foo`;

const numberExample = {
  html: `
<div>
  <p id="price">12.99</p>
</div>`,
  config: `selector: '#price' # do not forget the quotes!`,
};

const numberCastExample = {
  html: `
<div>
  <p id="price">12.99</p>
</div>`,
  config: `selector: '#price'
transform: number # use the number transformer`,
};

const spacesExample = {
  html: `
<div>
  <p id="product-title">
  
    Awesome Product
  
  </p>
</div>`,
  config: `selector: '#product-title'`,
};

const spacesTrimExample = {
  html: `
<div>
  <p id="product-title">
  
    Awesome Product
  
  </p>
</div>`,
  config: `selector: '#product-title'
transform: trim`,
};

const multipleTransformersExample = {
  html: `
<div>
  <span id="product-price">
  
    12.99
  
  </span>
</div>`,
  config: `selector: 'span#product-price'
transform: [trim, number]`,
};

export function Basics() {
  const result1 = usePureHtml({ inputHtml: html1, configYaml: yaml1 });

  return (
    <Box id="basics" mt="md">
      <Title order={2}>Basics</Title>

      <Text>Let's consider the this HTML:</Text>

      <HtmlSnippet code={html1} />

      <Text>
        Let's select the contents of <Code>.foo</Code> selector. Here is our
        configuration:
      </Text>

      <YamlSnippet code={yaml1} />

      <Text>The parser output will be exactly:</Text>

      <JsonSnippet code={result1} />

      <Title mt="md" order={4}>
        Extracting numbers
      </Title>

      <Text>That was easy! What if we want to extract a number?</Text>

      <PureHtmlSnippet
        inputHtml={numberExample.html}
        configYaml={numberExample.config}
      />

      <Title mt="md" order={4}>
        Type Casts (<Code>number</Code> transformer)
      </Title>

      <Text>
        As you might have noticed, our output is a <Code>string</Code>. We would
        want a <Code>number</Code> instead. We will adjust our configuration to
        type-cast our output to a <Code>number</Code>. We will just add{' '}
        <Code>transform: number</Code> line to our configuration.
      </Text>

      <PureHtmlSnippet
        inputHtml={numberCastExample.html}
        configYaml={numberCastExample.config}
      />

      <Title mt="md" order={4}>
        Trimming Text (<Code>trim</Code> transformer)
      </Title>

      <Text>
        Usually, the HTML is not formatted in the way we expect. The selectors
        would usually give us values with lots of spaces.
      </Text>

      <PureHtmlSnippet
        inputHtml={spacesExample.html}
        configYaml={spacesExample.config}
      />

      <Text>
        The spaces & new lines around the product title are not useful for us.
        So we <Code>trim</Code> them:
      </Text>

      <PureHtmlSnippet
        inputHtml={spacesTrimExample.html}
        configYaml={spacesTrimExample.config}
      />

      <Title mt="md" order={4}>
        Combining Transformers
      </Title>

      <Text>
        What if we want to apply several transformers to our output? If we want
        to <Code>trim</Code> and cast to <Code>number</Code>, we just add{' '}
        <Code>transform: [trim, number]</Code> to our configuration. Then the
        selector's output will be first trimmed, then casted to number.
      </Text>

      <PureHtmlSnippet
        inputHtml={multipleTransformersExample.html}
        configYaml={multipleTransformersExample.config}
      />

      <Text mt="md">
        We will explore the other transformers in{' '}
        <Anchor href="#transformers">Transormers</Anchor> section.
      </Text>
    </Box>
  );
}
