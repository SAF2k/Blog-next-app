import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

export async function mdxToHtml(source: string) {
  return await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm], // This is crucial for tables
      format: 'mdx',
    },
  });
}