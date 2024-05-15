import { Anchor, AnchorProps } from '@mantine/core';
import { useRouteLink } from '@react-nano/router';

export function DocsAnchor({
  children,
  href,
  ...rest
}: {
  children: string | JSX.Element;
  href: string;
} & Omit<AnchorProps, 'href'>) {
  const props = useRouteLink(href);

  return (
    <Anchor {...props} {...rest}>
      {children}
    </Anchor>
  );
}
