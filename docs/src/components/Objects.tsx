import { Alert, Box, Code, Text, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { PureHtmlSnippet } from './PureHtmlSnippet';

const basic = {
  html: `<div>
  <span class="firstname">John</span>
  <span class="lastname">Doe</span>
  <span class="age">42</span>
</div>`,
  config: `type: object
properties:
  firstName: { selector: .firstname }
  lastName: { selector: .lastname }
  age: { selector: .age }
`,
};

const transformer = {
  html: `<div id="course-details" data-course-id="9999">
  introduction and table-of-contents of the course...
  <h1>
    Web Scraping Fundamentals
  </h1>
</div>`,
  config: `selector: '#course-details'
type: object
properties:
  # if no other selector was provided, transformers will be executed
  # on the parent element
  courseId: { transform: [attr(data-course-id), number] }
  title: { selector: h1, transform: [trim] }
`,
};

export function Objects() {
  return (
    <Box id="objects" mt="md">
      <Title order={3}>Objects</Title>

      <Text>
        Extracting an array can be done by setting <br />
        <Code>
          {'{ type: object, properties: { property: <configuration> } } '}
        </Code>
        <br />
        in our config. Example:
      </Text>
      <PureHtmlSnippet inputHtml={basic.html} configYaml={basic.config} />

      <Title mt="md" order={5}>
        Appying transformers to the items:
      </Title>

      <Text>
        Let's say, we want to extract attributes of the matched items. We can
        use <Code>attr(...name: string[])</Code> transformer.
      </Text>

      <PureHtmlSnippet
        inputHtml={transformer.html}
        configYaml={transformer.config}
      />

      <Alert icon={<IconInfoCircle />} mt="sm">
        It's possible to omit <Code>type: object</Code> part if provide{' '}
        <Code>properties</Code>
      </Alert>
    </Box>
  );
}
