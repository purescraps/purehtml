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
import { Route, Router, Switch } from '@react-nano/router';
import { Home } from './Home';
import { Playground } from './Playground';

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
            <Anchor
              href={process.env.NODE_ENV === 'production' ? '/purehtml' : '/'}
            >
              PureHTML <Code>Documentation</Code>
            </Anchor>
            <Anchor href="/playground" pos="absolute" right="1em">
              Playground
            </Anchor>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink label="Introduction" href="/#intro" />
          <NavLink label="Getting Started" href="/#getting-started" />
          <NavLink label="Basics" href="/#basics" />
          <NavLink label="Constant Config" href="/#constant-config" />
          <NavLink label="Arrays" href="/#arrays" />
          <NavLink label="Objects" href="/#objects" />
          <NavLink label="Transformers" href="/#transformers" />
          <NavLink label="Union Config" href="/#union-config" />
        </AppShell.Navbar>
        <AppShell.Main>
          <Grid>
            <Grid.Col span={{ md: 8, sm: 12 }}>
              <Router>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/playground" component={Playground} />
                </Switch>
              </Router>
            </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
