import Link from 'next/link';
import { getPost } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, Clock, Home } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar } from '@/components/ui/calendar';

interface FrontMatter {
  title: string;
  description?: string;
  date?: string;
}

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
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 
      className="text-2xl font-semibold mt-12 mb-6 pb-2 border-b border-border/50 leading-snug" 
      {...props} 
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-10 mb-4 leading-snug" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="my-5 leading-relaxed text-foreground/90" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a
      className="text-primary hover:underline underline-offset-4 decoration-from-font"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="my-4 pl-6 space-y-2 list-disc" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 pl-6 space-y-2 list-decimal" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="pl-2" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote 
      className="border-l-4 border-primary/40 pl-4 py-1 my-6 text-muted-foreground italic" 
      {...props} 
    />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code 
      className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono" 
      {...props} 
    />
  ),
};

export default async function PostPage(
  {
    params,
  }: { params: Promise<{ category: string; slug: string }> }
) {
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

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li className="flex items-center">
            <Link 
              href="/" 
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
          <li className="flex items-center">
            <Link 
              href={categoryUrl} 
              className="hover:text-foreground transition-colors"
            >
              {formattedCategory}
            </Link>
          </li>
          <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
          <li className="font-medium text-foreground" aria-current="page">
            {frontMatter.title}
          </li>
        </ol>
      </nav>

      {/* Article */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        {/* Header */}
        <header className="mb-12">
          <div className="space-y-2">
            <Link 
              href={categoryUrl}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {formattedCategory}
            </Link>
            
            <h1 className="text-4xl font-bold tracking-tight leading-tight mt-2">
              {frontMatter.title}
            </h1>
            
            {frontMatter.description && (
              <p className="text-xl text-muted-foreground mt-3 leading-relaxed">
                {frontMatter.description}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
              {frontMatter.date && (
                <time 
                  dateTime={frontMatter.date} 
                  className="flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  {new Date(frontMatter.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {frontMatter.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {frontMatter.readingTime}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-16 prose-h3:mt-12 prose-p:my-6 prose-ul:my-6 prose-ol:my-6 prose-pre:bg-muted/50 prose-pre:rounded-lg prose-pre:border prose-pre:border-border/50 prose-pre:shadow-sm">
          <MDXRemote source={content} components={components} />
        </div>
      </article>

      {/* Back Button */}
      <div className="pt-12 mt-16 border-t border-border/50">
        <Button 
          variant="outline" 
          asChild 
          className="group gap-2"
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