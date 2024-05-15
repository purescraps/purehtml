import { Box, Text, Title } from '@mantine/core';

export function Intro() {
  return (
    <Box id="intro" mt="md">
      <Title order={3}>Introduction</Title>

      <Text>
        PureHTML is a HTML parsing specification for extracting useful data from
        HTMLs in the JSON form. <br />
        You may use Yaml to configure PureHTML parser, JSON support is also on
        the way.
      </Text>
    </Box>
  );
}
