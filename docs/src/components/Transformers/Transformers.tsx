import { Anchor, Box, Code, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { AttrTransformer } from './AttrTransformer';
import { ExistsTransformer } from './ExistsTransformer';
import { HtmlTransformer } from './HtmlTransformer';
import { JSONTransformer } from './JSONTransformer';
import { LengthTransformer } from './LengthTransformer';
import { NumberTransformer } from './NumberTransformer';
import { ResolveTransformer } from './ResolveTransformer';
import { TrimTransformer } from './TrimTransformer';
import { UrlQueryParamTransformer } from './UrlQueryParamTransformer';
import { RemoveUrlQueryParamTransformer } from './RemoveUrlQueryParamTransformer';

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
      {/* attr transformer */}
      <AttrTransformer />
      {/* exists transformer */}
      <ExistsTransformer />
      {/* html transformer */}
      <HtmlTransformer />
      {/* json transformer */}
      <JSONTransformer />
      {/* length transformer */}
      <LengthTransformer />
      {/* number transformer */}
      <NumberTransformer />
      {/* removeUrlQueryParam transformer */}
      <RemoveUrlQueryParamTransformer />
      {/* resolve transformer */}
      <ResolveTransformer />
      {/* trim transformer */}
      <TrimTransformer />
      {/* urlQueryParam transformer */}
      <UrlQueryParamTransformer />
    </Box>
  );
}
