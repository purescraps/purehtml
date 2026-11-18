import { Alert, Anchor, Box, Code, List, Text, Title } from '@mantine/core';
import { IconExternalLink, IconInfoCircle } from '@tabler/icons-react';
import { AttrTransformer } from './AttrTransformer';
import { BooleanTransformer } from './BooleanTransformer';
import { CapitalizeTransformer } from './CapitalizeTransformer';
import { ExistsTransformer } from './ExistsTransformer';
import { HtmlTransformer } from './HtmlTransformer';
import { JoinTransformer } from './JoinTransformer';
import { JSONTransformer } from './JSONTransformer';
import { JSONPathTransformer } from './JSONPathTransformer';
import { LengthTransformer } from './LengthTransformer';
import { LowerTransformer } from './LowerTransformer';
import { NumberTransformer } from './NumberTransformer';
import { ReplaceTransformer } from './ReplaceTransformer';
import { ResolveTransformer } from './ResolveTransformer';
import { SplitTransformer } from './SplitTransformer';
import { TrimTransformer } from './TrimTransformer';
import { UpperTransformer } from './UpperTransformer';
import { UrlQueryParamTransformer } from './UrlQueryParamTransformer';
import { RemoveUrlQueryParamTransformer } from './RemoveUrlQueryParamTransformer';
import { RemoveLastPathSectionTransformer } from './RemoveLastPathSectionTransformer';

export function Transformers() {
  return (
    <Box id="transformers" mt="md">
      <Title order={3}>Transformers</Title>
      <Anchor
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors"
        rel="nofollow"
        target="_blank"
      >
        Selectors <IconExternalLink size={16} />
      </Anchor>
      give us <Code>string</Code> values of the{' '}
      <Anchor
        href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText"
        rel="nofollow"
        target="_blank"
      >
        <Code>innerText</Code>
      </Anchor>{' '}
      of the given HTMLElement. You may want to <Code>trim</Code> the result,
      cast output to <Code>number</Code>. Or you may also need to extract an{' '}
      <Code>attribute</Code> of the matched element. These cases and more can be
      handled by the use of transformers.

      <Alert
        icon={<IconInfoCircle />}
        title="Transformer Argument Quoting Rules"
        color="blue"
        radius="md"
        mt="md"
        mb="md"
      >
        <Text size="sm">
          PureHTML transformers support flexible parameter syntax, but arguments
          containing spaces, commas, colons, or regex escape sequences require
          specific quoting rules:
        </Text>

        <List size="sm" mt="xs" spacing="xs">
          <List.Item>
            <b>Bare (unquoted) arguments:</b> Simple identifiers matching{' '}
            <Code>[\w-]+</Code> (letters, digits, underscores, hyphens) can be
            written without quotes, e.g.{' '}
            <Code>attr(href)</Code>, <Code>trim</Code>, or <Code>split(-)</Code>.
          </List.Item>
          <List.Item>
            <b>Quoted arguments (<Code>"..."</Code> or <Code>'...'</Code>):</b>{' '}
            Arguments containing <b>spaces</b>, <b>commas</b>, <b>colons</b>, or{' '}
            <b>regex metacharacters</b> must be enclosed in single or double
            quotes. Examples:
            <List size="xs" mt={4} spacing={2}>
              <List.Item>
                <Code>replace("\s+", " ")</Code> or <Code>replace(",", "")</Code>
              </List.Item>
              <List.Item>
                <Code>split(", ")</Code> or <Code>split("::")</Code>
              </List.Item>
              <List.Item>
                <Code>join(" - ")</Code> or <Code>join(", ")</Code>
              </List.Item>
              <List.Item>
                <Code>urlQueryParam("utm_source")</Code> or{' '}
                <Code>urlQueryParam('ref')</Code>
              </List.Item>
            </List>
          </List.Item>
          <List.Item>
            <b>Escaping inside quotes:</b> A backslash escapes the enclosing
            quote character (<Code>\"</Code> inside <Code>"..."</Code> or{' '}
            <Code>\'</Code> inside <Code>'...'</Code>) or a literal backslash (
            <Code>\\</Code>). Regex escape sequences like <Code>\s</Code>,{' '}
            <Code>\d</Code>, and <Code>\w</Code> are preserved verbatim and
            passed untouched to regex engines.
          </List.Item>
          <List.Item>
            <b>YAML quoting tip:</b> In YAML schemas, prevent YAML parser syntax
            collisions by quoting the entire transform expression (e.g.{' '}
            <Code>transform: 'replace("\s+", " ")'</Code>) or using YAML list
            notation (<Code>- replace("\s+", " ")</Code>).
          </List.Item>
        </List>
      </Alert>
      {/* attr transformer */}
      <AttrTransformer />
      {/* boolean transformer */}
      <BooleanTransformer />
      {/* capitalize transformer */}
      <CapitalizeTransformer />
      {/* exists transformer */}
      <ExistsTransformer />
      {/* html transformer */}
      <HtmlTransformer />
      {/* join transformer */}
      <JoinTransformer />
      {/* json transformer */}
      <JSONTransformer />
      {/* jsonpath transformer */}
      <JSONPathTransformer />
      {/* length transformer */}
      <LengthTransformer />
      {/* lower transformer */}
      <LowerTransformer />
      {/* number transformer */}
      <NumberTransformer />
      {/* removeLastPathSection transformer */}
      <RemoveLastPathSectionTransformer/>
      {/* removeUrlQueryParam transformer */}
      <RemoveUrlQueryParamTransformer />
      {/* replace transformer */}
      <ReplaceTransformer />
      {/* resolve transformer */}
      <ResolveTransformer />
      {/* split transformer */}
      <SplitTransformer />
      {/* trim transformer */}
      <TrimTransformer />
      {/* upper transformer */}
      <UpperTransformer />
      {/* urlQueryParam transformer */}
      <UrlQueryParamTransformer />
    </Box>
  );
}
