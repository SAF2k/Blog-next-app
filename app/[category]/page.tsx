import Link from 'next/link';
import { getPostsByCategory } from '@/lib/mdx';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  // Extract the category from params
  const { category } = await params;
  
  // Now use the extracted category
  const posts = await getPostsByCategory(category);

  if (!posts) {
    notFound();
  }

  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    return (
      <div className="container py-12 space-y-12">
        {/* Header Section */}
        <header className="space-y-4 text-center">
          <nav aria-label="Breadcrumb" className="flex justify-center">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  aria-label="Go to Home"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              <li className="text-foreground font-medium" aria-current="page">
                {formattedCategory}
              </li>
            </ol>
          </nav>
  
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formattedCategory}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of {formattedCategory.toLowerCase()} articles, guides, and resources.
            </p>
          </div>
        </header>
  
        {/* Content Section */}
        <section>
          {posts.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16 px-6 rounded-xl border border-dashed border-border bg-muted/30">
              <div className="flex flex-col items-center space-y-4">
                <BookOpen className="w-12 h-12 text-primary/70" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight">No articles found</h3>
                  <p className="text-muted-foreground">
                    We couldn&apos;t find any articles in this category yet. Check back soon for updates!
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/" className="gap-2">
                    <HomeIcon className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="group h-full">
            <Link
              href={`/${category}/${post.slug}`}
              className="h-full flex flex-col"
              aria-label={`Read article: ${post.title}`}
            >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/30">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        {post.description && (
                          <CardDescription className="mt-1.5 line-clamp-3">
                            {post.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardFooter className="mt-auto pt-0">
                        <div className="w-full flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Read more
                          </span>
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
  
        {/* Back to Categories */}
        <footer className="pt-8 border-t border-border/50">
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              asChild 
              className="group gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link href="/" aria-label="Back to all categories">
                <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                <span>Back to all categories</span>
              </Link>
            </Button>
          </div>
        </footer>
      </div>
    );
  }