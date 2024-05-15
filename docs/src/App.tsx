import {
  Anchor,
  AppShell,
  Burger,
  Code,
  Grid,
  Group,
  NavLink,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Arrays } from './components/Arrays';
import { Basics } from './components/Basics';
import { ConstantConfig } from './components/ConstantConfig';
import { GettingStarted } from './components/GettingStarted';
import { Intro } from './components/Intro';
import { Objects } from './components/Objects';
import { Transformers } from './components/Transformers/Transformers';
import { UnionConfig } from './components/UnionConfig';

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: false },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Anchor href="/">
              PureHTML <Code>Documentation</Code>
            </Anchor>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink label="Introduction" href="#intro" />
          <NavLink label="Getting Started" href="#getting-started" />
          <NavLink label="Basics" href="#basics" />
          <NavLink label="Constant Config" href="#constant-config" />
          <NavLink label="Arrays" href="#arrays" />
          <NavLink label="Objects" href="#objects" />
          <NavLink label="Transformers" href="#transformers" />
          <NavLink label="Union Config" href="#union-config" />
        </AppShell.Navbar>
        <AppShell.Main>
          <Grid>
            <Grid.Col span={{ md: 8, sm: 12 }}>
              <Intro />
              <GettingStarted />
              <Basics />
              <ConstantConfig />
              <Arrays />
              <Objects />
              <Transformers />
              <UnionConfig />
            </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
