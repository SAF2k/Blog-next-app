// components/CategorySearch.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/mdx';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { ArrowRight, BookOpen, Search } from 'lucide-react';

interface CategorySearchProps {
  categories: Category[];
}

export default function CategorySearch({ categories }: CategorySearchProps) {
  const [query, setQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    return categories.filter((category) => {
      const name = category.slug || category.name || '';
      return name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, categories]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="category-search"
            type="search"
            placeholder="Search categories..."
            aria-label="Search categories"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            No categories found for &quot;{query}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const categorySlug = category.slug || category.name;
            const formattedName = categorySlug
              .split('-')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <Link
                key={categorySlug}
                href={`/${categorySlug}`}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-border/50 group-hover:border-primary/40 group-hover:-translate-y-0.5 duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
                        {formattedName}
                      </CardTitle>
                      {category.count != null && (
                        <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {category.count} {category.count === 1 ? 'article' : 'articles'}
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      Explore our {formattedName.toLowerCase()} documentation and resources.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <span className="flex items-center text-sm text-primary font-medium gap-1 pl-0 group-hover:gap-2 transition-all">
                      View Documentation
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
