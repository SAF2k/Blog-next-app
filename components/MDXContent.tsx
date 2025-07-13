'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { MDXComponents } from 'mdx/types';

// Custom table components
const components: MDXComponents = {
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th 
      className="border border-muted bg-muted/50 p-3 text-left font-semibold" 
      {...props} 
    />
  ),
  td: (props) => (
    <td 
      className="border border-muted p-3" 
      {...props} 
    />
  ),
  // You can add more custom components here
};

type Props = {
  source: MDXRemoteSerializeResult;
  components?: MDXComponents;
};

export default function MDXContent({ source, components: propComponents }: Props) {
  return (
    <div className="prose prose-neutral prose-lg dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      <MDXRemote 
        {...source} 
        components={{
          ...components,
          ...propComponents,
        }} 
      />
    </div>
  );
}