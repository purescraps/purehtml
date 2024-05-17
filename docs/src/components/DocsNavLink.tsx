import { NavLink, NavLinkProps } from '@mantine/core';
import Link from 'next/link';

export function DocsNavLink({
  href,
  ...rest
}: { href: string } & Omit<NavLinkProps, 'href'>) {
  return <NavLink component={Link} {...rest} href={href} />;
}
