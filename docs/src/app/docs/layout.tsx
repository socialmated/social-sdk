import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { JSX, ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
