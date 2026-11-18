import { CodeHighlight, CodeHighlightTabs } from '@mantine/code-highlight';
import { Anchor, Box, Tabs, Text, Title, rem } from '@mantine/core';
import {
  IconBrandGolang,
  IconBrandNpm,
  IconBrandPnpm,
  IconBrandPython,
  IconBrandTypescript,
  IconBrandYarn,
  IconCoffee,
  IconDiamond,
} from '@tabler/icons-react';

const tsUsage = `import { ConfigFactory, extract } from '@purescraps/purehtml';

const input = \`<div>
  <p>foo</p>
  <p>bar</p>
  <p>baz</p>
</div>\`;
const config = ConfigFactory.fromYAML('selector: p');
const result = extract(input, config, 'https://example.com');`;

const goUsage = `package main

import (
	"fmt"
	"log"

	"github.com/purescraps/purehtml/go"
)

func main() {
	html := \`<div>
  <p>foo</p>
  <p>bar</p>
  <p>baz</p>
</div>\`

	factory := purehtml.NewConfigFactory()
	config, err := factory.FromYAML("selector: p")
	if err != nil {
		log.Fatal(err)
	}

	result, err := purehtml.ExtractFromString(purehtml.DefaultBackend, html, config, "https://example.com")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(result)
}`;

const pyUsage = `from purehtml import ConfigFactory, extract

html = """<div>
  <p>foo</p>
  <p>bar</p>
  <p>baz</p>
</div>"""

config = ConfigFactory.from_yaml("selector: p")
result = extract(config, html, "https://example.com")

print(result)`;

const javaUsage = `import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;
import static com.purescraps.purehtml.PureHTML.extract;

public class Main {
    public static void main(String[] args) {
        String html = """
            <div>
              <p>foo</p>
              <p>bar</p>
              <p>baz</p>
            </div>
            """;

        Config config = ConfigFactory.fromYAML("selector: p");
        Object result = extract(config, html, "https://example.com");

        System.out.println(result);
    }
}`;

const rubyUsage = `require 'purehtml'

html = <<~HTML
  <div>
    <p>foo</p>
    <p>bar</p>
    <p>baz</p>
  </div>
HTML

config = PureHTML::ConfigFactory.from_yaml("selector: p")
result = PureHTML.extract(config, html, "https://example.com")

puts result`;

export function GettingStarted() {
  return (
    <Box id="getting-started" mt="md">
      <Title order={3}>Getting Started</Title>

      <Text mt="xs">
        PureHTML is a cross-language specification implemented in TypeScript, Go,
        Python, Java, and Ruby. Select your language below to see installation and usage:
      </Text>

      <Tabs defaultValue="typescript" mt="sm">
        <Tabs.List>
          <Tabs.Tab
            value="typescript"
            leftSection={<IconBrandTypescript width={rem(18)} />}
          >
            TypeScript / Node
          </Tabs.Tab>
          <Tabs.Tab
            value="go"
            leftSection={<IconBrandGolang width={rem(18)} />}
          >
            Go
          </Tabs.Tab>
          <Tabs.Tab
            value="python"
            leftSection={<IconBrandPython width={rem(18)} />}
          >
            Python
          </Tabs.Tab>
          <Tabs.Tab
            value="java"
            leftSection={<IconCoffee width={rem(18)} />}
          >
            Java
          </Tabs.Tab>
          <Tabs.Tab
            value="ruby"
            leftSection={<IconDiamond width={rem(18)} />}
          >
            Ruby
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="typescript" pt="sm">
          <Text>
            Install the{' '}
            <Anchor
              href="https://npmjs.com/package/@purescraps/purehtml"
              rel="nofollow"
              target="_blank"
            >
              @purescraps/purehtml
            </Anchor>{' '}
            package with your favorite package manager:
          </Text>

          <CodeHighlightTabs
            code={[
              {
                code: 'npm i -S @purescraps/purehtml',
                language: 'bash',
                fileName: 'npm',
                icon: <IconBrandNpm width={rem(20)} />,
              },
              {
                code: 'yarn add @purescraps/purehtml',
                language: 'bash',
                fileName: 'yarn',
                icon: <IconBrandYarn width={rem(20)} />,
              },
              {
                code: 'pnpm add @purescraps/purehtml',
                language: 'bash',
                fileName: 'pnpm',
                icon: <IconBrandPnpm width={rem(20)} />,
              },
            ]}
            mt="sm"
          />

          <Text mt="sm">Usage:</Text>
          <CodeHighlight code={tsUsage} lang="typescript" mt="xs" />
        </Tabs.Panel>

        <Tabs.Panel value="go" pt="sm">
          <Text>
            Install the{' '}
            <Anchor
              href="https://pkg.go.dev/github.com/purescraps/purehtml/go"
              rel="nofollow"
              target="_blank"
            >
              Go module
            </Anchor>:
          </Text>

          <CodeHighlightTabs
            code={[
              {
                code: 'go get github.com/purescraps/purehtml/go',
                language: 'bash',
                fileName: 'go get',
                icon: <IconBrandGolang width={rem(20)} />,
              },
            ]}
            mt="sm"
          />

          <Text mt="sm">Usage:</Text>
          <CodeHighlight code={goUsage} lang="go" mt="xs" />
        </Tabs.Panel>

        <Tabs.Panel value="python" pt="sm">
          <Text>
            Install the{' '}
            <Anchor
              href="https://pypi.org/project/purehtml-purescraps/"
              rel="nofollow"
              target="_blank"
            >
              purehtml-purescraps
            </Anchor>{' '}
            package with pip or poetry:
          </Text>

          <CodeHighlightTabs
            code={[
              {
                code: 'pip install purehtml-purescraps',
                language: 'bash',
                fileName: 'pip',
                icon: <IconBrandPython width={rem(20)} />,
              },
              {
                code: 'poetry add purehtml-purescraps',
                language: 'bash',
                fileName: 'poetry',
                icon: <IconBrandPython width={rem(20)} />,
              },
            ]}
            mt="sm"
          />

          <Text mt="sm">Usage:</Text>
          <CodeHighlight code={pyUsage} lang="python" mt="xs" />
        </Tabs.Panel>

        <Tabs.Panel value="java" pt="sm">
          <Text>
            Add the dependency to your project via Maven or Gradle:
          </Text>

          <CodeHighlightTabs
            code={[
              {
                code: `<dependency>
  <groupId>com.purescraps.purehtml</groupId>
  <artifactId>purehtml</artifactId>
  <version>0.1.0</version>
</dependency>`,
                language: 'xml',
                fileName: 'pom.xml',
                icon: <IconCoffee width={rem(20)} />,
              },
              {
                code: "implementation 'com.purescraps.purehtml:purehtml:0.1.0'",
                language: 'groovy',
                fileName: 'build.gradle',
                icon: <IconCoffee width={rem(20)} />,
              },
            ]}
            mt="sm"
          />

          <Text mt="sm">Usage:</Text>
          <CodeHighlight code={javaUsage} lang="java" mt="xs" />
        </Tabs.Panel>

        <Tabs.Panel value="ruby" pt="sm">
          <Text>
            Install the{' '}
            <Anchor
              href="https://rubygems.org/gems/purehtml"
              rel="nofollow"
              target="_blank"
            >
              purehtml
            </Anchor>{' '}
            gem with RubyGems or Bundler:
          </Text>

          <CodeHighlightTabs
            code={[
              {
                code: 'gem install purehtml',
                language: 'bash',
                fileName: 'gem',
                icon: <IconDiamond width={rem(20)} />,
              },
              {
                code: 'bundle add purehtml',
                language: 'bash',
                fileName: 'bundle',
                icon: <IconDiamond width={rem(20)} />,
              },
            ]}
            mt="sm"
          />

          <Text mt="sm">Usage:</Text>
          <CodeHighlight code={rubyUsage} lang="ruby" mt="xs" />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
