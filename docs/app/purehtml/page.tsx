'use client';

import { Grid } from '@mantine/core';
import { Arrays } from '../../src/components/Arrays';
import { Basics } from '../../src/components/Basics';
import { ConstantConfig } from '../../src/components/ConstantConfig';
import { GettingStarted } from '../../src/components/GettingStarted';
import { Intro } from '../../src/components/Intro';
import { Objects } from '../../src/components/Objects';
import { Transformers } from '../../src/components/Transformers/Transformers';
import { UnionConfig } from '../../src/components/UnionConfig';
import { AppLayout } from '../app-layout';

export default function Page() {
  return (
    <AppLayout>
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
    </AppLayout>
  );
}
