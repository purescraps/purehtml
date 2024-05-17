import { MantineProvider } from '@mantine/core';
import type { Metadata } from 'next';

import { theme } from './theme';

// either Static metadata
export const metadata: Metadata = {
  title: "PureHTML's Documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
