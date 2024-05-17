import { Anchor, AnchorProps } from '@mantine/core';
import Link from 'next/link';

export function DocsAnchor({
  children,
  href,
  ...rest
}: {
  children: string | JSX.Element;
  href: string;
} & Omit<AnchorProps, 'href'>) {
  return (
    <Anchor component={Link} href={href} {...rest}>
      {children}
    </Anchor>
  );
}
