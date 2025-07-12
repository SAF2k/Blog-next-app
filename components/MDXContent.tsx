'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { MDXComponents } from 'mdx/types';

type Props = {
  source: MDXRemoteSerializeResult;
  components?: MDXComponents;
};

export default function MDXContent({ source, components }: Props) {
  return (
    <div className="prose prose-neutral prose-lg dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
