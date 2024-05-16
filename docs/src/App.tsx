import { AppShell, Burger, Code, Grid, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Route, Switch, useRouter } from '@react-nano/router';
import { useCallback } from 'react';
import { Home } from './Home';
import { Playground } from './Playground';
import { DocsAnchor } from './components/DocsAnchor';
import { DocsNavLink } from './components/DocsNavLink';
import { basePath } from './constants';

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const makeClickHandler = useCallback(
    (targetElemId: string) => {
      return () => {
        const offsetTop = document.getElementById(targetElemId)?.offsetTop;

        if (offsetTop) {
          window.scrollTo({ top: offsetTop - 60 });
        }

        toggleMobile();
      };
    },
    [toggleMobile]
  );
  const router = useRouter();
  const inPlayground = router.path.endsWith('playground');

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
            <DocsAnchor href={`${basePath}/`} size="sm">
              <>
                PureHTML <Code>Documentation</Code>
              </>
            </DocsAnchor>

            <DocsAnchor
              href={`${basePath}/playground`}
              pos={{ sm: 'relative', md: 'absolute' }}
              right={{ sm: '', md: '1em' }}
              size="sm"
            >
              Playground
            </DocsAnchor>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <DocsNavLink
            label="Introduction"
            href="/#intro"
            onClick={makeClickHandler('intro')}
          />
          <DocsNavLink
            label="Getting Started"
            href="/#getting-started"
            onClick={makeClickHandler('getting-started')}
          />
          <DocsNavLink
            label="Basics"
            href="/#basics"
            onClick={makeClickHandler('basics')}
          />
          <DocsNavLink
            label="Constant Config"
            href="/#constant-config"
            onClick={makeClickHandler('constant-config')}
          />
          <DocsNavLink
            label="Arrays"
            href="/#arrays"
            onClick={makeClickHandler('arrays')}
          />
          <DocsNavLink
            label="Objects"
            href="/#objects"
            onClick={makeClickHandler('objects')}
          />
          <DocsNavLink
            label="Transformers"
            href="/#transformers"
            onClick={makeClickHandler('transformers')}
          />
          <DocsNavLink
            label="Union Config"
            href="/#union-config"
            onClick={makeClickHandler('union-config')}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Grid>
            <Switch>
              <Route path={`${basePath}/`} component={Home} />
              <Route path={`${basePath}/playground`} component={Playground} />
            </Switch>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
