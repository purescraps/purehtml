import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

const html = `
<div>
  <a href="http://example.com/some/products/1?utm_source=purescraps&utm_medium=purehtml">product 1</a>
  <a href="http://example.com/some/products/2?utm_source=purescraps&utm_medium=purehtml">product 2</a>
  <a href="http://example.com/some/products/3?utm_source=purescraps&utm_medium=purehtml">product 3</a>
</div>
`;

export function RemoveUrlQueryParamTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>removeUrlQueryParam</Code> transformer
      </Title>
      <Text>Removes query parameters from the URLs.</Text>
      <Accordion multiple>
        <Accordion.Item value="single">
          <Accordion.Control h={rem(35)}>
            Removes a single query parameter
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: div a, items: { transform: [attr(href), removeUrlQueryParam(utm_source)] } }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="multiple">
          <Accordion.Control h={rem(35)}>
            Removes multiple query parameters.
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: div a, items: { transform: [attr(href), 'removeUrlQueryParam(utm_source, utm_medium)'] } }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
