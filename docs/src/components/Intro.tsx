import { Box, Text, Title } from '@mantine/core';

export function Intro() {
  return (
    <Box id="intro">
      <Title order={1}>PureHTML</Title>

      <Text>
        PureHTML is a HTML parsing specification for extracting useful data from
        HTMLs in the JSON form. <br />
        <br />
        You may use Yaml to configure PureHTML parser, JSON support is also on
        the way.
      </Text>
    </Box>
  );
}
