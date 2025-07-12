import { getCategories } from '@/lib/mdx';
import { BookOpen, Layers, BookMarked, MessageSquare } from 'lucide-react';
import CategorySearch from '@/components/CategorySearch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SearchButton from '@/components/SearchButton';

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 border-b">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Layers className="w-4 h-4 mr-2" />
              Documentation Hub
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Explore Our Knowledge Base
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive guides, tutorials, and resources to help you master new technologies and concepts.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#categories">
                <Button asChild size="lg" className="gap-2">
                  <span>
                    <BookMarked className="h-4 w-4" />
                    Browse Categories
                  </span>
                </Button>
              </Link>
              <SearchButton />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Documentation Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our organized collection of documentation by category
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-2xl mx-auto">
              <BookOpen className="w-16 h-16 text-muted-foreground/30" />
              <h3 className="text-2xl font-semibold">No categories available</h3>
              <p className="text-muted-foreground">
                We&apos;re currently working on adding new documentation. Please check back soon!
              </p>
            </div>
          ) : (
            <CategorySearch categories={categories} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              Need Help or Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button asChild size="lg" className="gap-2">
                  <span>Contact Support</span>
                </Button>
              </Link>
              <Link href="/docs/guide">
                <Button asChild variant="outline" size="lg">
                  <span>View Documentation Guide</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
