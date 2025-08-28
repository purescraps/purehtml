import { Anchor, AnchorProps } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';

export function DocsAnchor({
  children,
  href,
  ...rest
}: {
  children: ReactNode;
  href: string;
} & Omit<AnchorProps, 'href'>) {
  return (
    <Anchor component={Link} href={href} {...rest}>
      {children}
    </Anchor>
  );
}
