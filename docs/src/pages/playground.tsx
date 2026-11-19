import { Playground } from '@/Playground';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function PlaygroundPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <Playground />
    </HomeLayout>
  );
}

export async function getConfig() {
  return {
    render: 'static',
  } as const;
}
