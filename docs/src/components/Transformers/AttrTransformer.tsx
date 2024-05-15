import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function AttrTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>attr</Code> transformer
      </Title>
      <Text>
        It can extract an individual attribute's value. It can also extract all
        or subset of the element's attributes with their values.
      </Text>
      <Text>Examples:</Text>
      <Accordion multiple>
        <Accordion.Item value="single">
          <Accordion.Control h={rem(35)}>
            Extract a single attribute's value: <Code>attr(data-name)</Code>
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml='<div data-id="123"></div>'
              configYaml="{ selector: div, transform: 'attr(data-id)' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="all">
          <Accordion.Control h={rem(35)}>
            Extract all attributes: <Code>attr</Code> or <Code>attr()</Code>
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml='<div data-id="123" data-full-name="John Doe"></div>'
              configYaml="{ selector: div, transform: 'attr()' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="subset">
          <Accordion.Control h={rem(35)}>
            Extract subset of the attributes:{' '}
            <Code>attr(data-id, data-name)</Code>
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml='<div data-id="123" data-first-name="John" data-last-name="Doe"></div>'
              configYaml="{ selector: div, transform: 'attr(data-first-name, data-last-name)' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
