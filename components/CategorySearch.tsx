// components/CategorySearch.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/mdx'; // make sure this is exported from mdx.ts
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      <input
        id="category-search"
        type="search"
        placeholder="Search categories..."
        aria-label="Search categories"
        className="w-full max-w-md mx-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredCategories.length === 0 ? (
        <p className="text-center text-muted-foreground mt-6">
          No categories found for &quot;{query}&quot;.
        </p>
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
                <Card className="h-full overflow-hidden transition-all hover:shadow-md border-border/50 group-hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {formattedName}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      Explore our {formattedName.toLowerCase()} documentation and
                      resources.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="pl-0 group-hover:pl-2 transition-all"
                      asChild
                    >
                      <span>
                        View Documentation
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
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
