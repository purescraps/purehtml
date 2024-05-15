import { AppShell, Burger, Grid, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Intro } from './components/Intro';
import { Basics } from './components/Basics';
import { GettingStarted } from './components/GettingStarted';
import { Arrays } from './components/Arrays';

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
            PureHTML Documentation
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink label="Introduction" href="#intro" />
          <NavLink label="Getting Started" href="#getting-started" />
          <NavLink label="Basics" href="#basics" />
          <NavLink label="Arrays" href="#arrays" />
          <NavLink label="Objects" href="#objects" />
        </AppShell.Navbar>
        <AppShell.Main>
          <Grid>
            <Grid.Col span={{ md: 8, sm: 12 }}>
              <GettingStarted />
              <Intro />
              <Basics />
              <Arrays />
            </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
