import { Anchor, Box, Code, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { AttrTransformer } from './AttrTransformer';
import { BooleanTransformer } from './BooleanTransformer';
import { CapitalizeTransformer } from './CapitalizeTransformer';
import { ExistsTransformer } from './ExistsTransformer';
import { HtmlTransformer } from './HtmlTransformer';
import { JoinTransformer } from './JoinTransformer';
import { JSONTransformer } from './JSONTransformer';
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
