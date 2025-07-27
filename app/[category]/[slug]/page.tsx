import Link from 'next/link';
import { getPost } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, Calendar, ChevronRight, HomeIcon, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import MermaidChart from '@/components/MermaidChart';
import readingTime from 'reading-time';
import CodeBlock from '@/components/CodeBlock';

interface FrontMatter {
  title: string;
  description?: string;
  date?: string;
  readingTime?: string;
}

export async function generateMetadata(
  context: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const { category, slug } = await context.params;

  let post: { frontMatter: FrontMatter; content: string };

  try {
    post = await getPost(category, slug);
  } catch (err) {
    console.error(`Error loading post for metadata [${category}/${slug}]:`, err);
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }

  const { frontMatter } = post;

  return {
    title: frontMatter.title,
    description: frontMatter.description || `Read more about ${frontMatter.title}`,
  };
}

const components = {
  MermaidChart,
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold mt-10 mb-4 tracking-tight text-foreground" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-3xl font-bold mt-14 mb-6 pb-2 border-b border-border/50 tracking-tight"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold mt-10 mb-4 tracking-tight text-muted-foreground" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="my-5 leading-relaxed text-base text-foreground/90" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a
      className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => {
    if (props.className?.includes('language-')) {
      return <CodeBlock {...props} />;
    }
    return <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />;
  },
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre className="rounded-lg overflow-auto text-sm font-mono" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="my-4 pl-6 space-y-2 list-disc" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 pl-6 space-y-2 list-decimal" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="pl-2 text-foreground/90" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary/40 pl-4 py-3 my-6 text-muted-foreground italic bg-muted/5 rounded-lg"
      {...props}
    />
  ),
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border/50 bg-background">
      <table className="w-full border-collapse text-sm [&_*]:border-border/50" {...props} />
    </div>
  ),
  thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-muted/50 sticky top-0 z-10 text-left" {...props} />
  ),
  tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border even:bg-muted/10" {...props} />
  ),
  tr: (props: React.HTMLProps<HTMLTableRowElement>) => (
    <tr className="hover:bg-muted/30 transition-colors duration-200" {...props} />
  ),
  th: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-muted-foreground" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-foreground/90" {...props} />
  ),
};

export default async function PostPage({
  params,
}: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;

  let post: { frontMatter: FrontMatter; content: string };

  try {
    post = await getPost(category, slug);
  } catch (err) {
    console.error(`Error loading post [${category}/${slug}]:`, err);
    notFound();
  }

  const { frontMatter, content } = post;

  const formattedCategory = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryUrl = `/${category}`;

  const stats = readingTime(content);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          <ChevronRight className="mr-1.5 h-4 w-4" />
          <li className="flex items-center">
            <Link
              href={`/${category}`}
              className="hover:text-foreground transition-colors"
            >
              {formattedCategory}
            </Link>
          </li>
          <ChevronRight className="mr-1.5 h-4 w-4" />
          <li className="font-medium text-foreground" aria-current="page">
            {frontMatter.title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="mr-1.5 h-4 w-4" />
          {formattedCategory}
        </Link>
        <br />
        <h1 className="text-4xl font-bold tracking-tight">{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="text-muted-foreground text-base">{frontMatter.description}</p>
        )}
        <div className="flex items-center gap-4">
        {frontMatter.date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={frontMatter.date}>
              {new Date(frontMatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )}
        {/* ⏱️ Reading Time */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{stats.text}</span> {/* e.g. "3 min read" */}
        </div>
        </div>
      </header>

      {/* MDX Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none [&_pre]:!my-6 [&_table]:!my-6">
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              format: 'mdx',
            },
          }}
        />
      </div>

      {/* Back Button */}
      <div className="pt-12 mt-16 border-t border-border/50">
        <Button
          variant="outline"
          asChild
          className="group gap-2 transition-all hover:shadow-sm hover:-translate-y-0.5"
        >
          <Link href={categoryUrl} className="text-base">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to {formattedCategory}
          </Link>
        </Button>
      </div>
    </div>
  );
}
