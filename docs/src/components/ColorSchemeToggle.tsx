'use client';

import {
  MantineColorScheme,
  Switch,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  // nextjs, isClient'ı kullanmazsak sunucu tarafında da bu bileşeni derlemeye çalışıyor.
  // html çıktısı sunucu ve istemci tarafında farklı olduğu için de hydration error diye hata veriyor.
  // her ne kadar en üstte use client, demiş olsak da nextjs bu bileşeni sunucu tarafında da derlemeye çalışıyor.
  // ben de kendilerinin önerdiği çözümü kullandım:
  // https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  if (!isClient) {
    return <></>;
  }

  return (
    <Switch
      size="md"
      color="dark.4"
      onLabel={sunIcon}
      offLabel={moonIcon}
      defaultChecked={colorScheme === 'light'}
      onChange={(ev) => {
        const selectedColorScheme: MantineColorScheme = ev.currentTarget.checked
          ? 'light'
          : 'dark';

        setColorScheme(selectedColorScheme);
      }}
    />
  );
}
