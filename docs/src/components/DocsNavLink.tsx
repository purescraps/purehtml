import { NavLink, NavLinkProps } from '@mantine/core';
import { useRouteLink } from '@react-nano/router';

export function DocsNavLink({
  href,
  onClick,
  ...rest
}: { href: string } & Omit<NavLinkProps, 'href'>) {
  const props = useRouteLink(href, onClick);

  return <NavLink {...rest} {...props} />;
}
