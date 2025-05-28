import type { JSX, ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';

export default function Layout({ children }: { readonly children: ReactNode }): JSX.Element {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
