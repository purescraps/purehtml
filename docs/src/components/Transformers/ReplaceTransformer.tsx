import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function ReplaceTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>replace</Code> transformer
      </Title>
      <Text>
        Replaces every match of a regular expression <Code>pattern</Code>{' '}
        with <Code>replacement</Code>. Arguments that contain commas, spaces,
        or regex metacharacters must be quoted.
      </Text>
      <Accordion multiple>
        <Accordion.Item value="regex">
          <Accordion.Control h={rem(35)}>
            Replace a regex match
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>foo 123 bar 456</div>"
              configYaml={`{ selector: div, transform: 'replace("\\d+", "#")' }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="literal">
          <Accordion.Control h={rem(35)}>
            Replace a literal pattern
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>a-b-c</div>"
              configYaml="{ selector: div, transform: 'replace(-, _)' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
