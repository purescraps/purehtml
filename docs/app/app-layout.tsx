'use client';

import { AppShell, Burger, Code, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTerminal2 } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { ColorSchemeToggle } from '../src/components/ColorSchemeToggle';
import { DocsAnchor } from '../src/components/DocsAnchor';
import { DocsNavLink } from '../src/components/DocsNavLink';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const pathname = usePathname();
  const inPlayground = pathname.endsWith('playground');
  const closeBurger = useCallback(() => toggleMobile(), [toggleMobile]);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: inPlayground || false },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px={{ sm: 'sm', md: 'md' }} gap="sm">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <DocsAnchor href="/" size="sm">
              <>
                PureHTML <Code>Documentation</Code>
              </>
            </DocsAnchor>

            <ColorSchemeToggle />

            <DocsAnchor
              href="/playground"
              pos="absolute"
              right="1em"
              size="sm"
              visibleFrom="xs"
            >
              Playground
            </DocsAnchor>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <DocsNavLink
            hiddenFrom="xs"
            href="/playground"
            label="Playground"
            leftSection={<IconTerminal2 />}
            mb="sm"
            onClick={closeBurger}
          />

          <DocsNavLink
            label="Introduction"
            href="/#intro"
            onClick={closeBurger}
          />
          <DocsNavLink
            label="Getting Started"
            href="/#getting-started"
            onClick={closeBurger}
          />
          <DocsNavLink label="Basics" href="/#basics" onClick={closeBurger} />
          <DocsNavLink
            label="Constant Config"
            href="/#constant-config"
            onClick={closeBurger}
          />
          <DocsNavLink label="Arrays" href="/#arrays" onClick={closeBurger} />
          <DocsNavLink label="Objects" href="/#objects" onClick={closeBurger} />
          <DocsNavLink
            label="Transformers"
            href="/#transformers"
            onClick={closeBurger}
          />
          <DocsNavLink
            label="Union Config"
            href="/#union-config"
            onClick={closeBurger}
          />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
