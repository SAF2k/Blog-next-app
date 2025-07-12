// components/SearchButton.tsx
'use client';

import { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type SearchButtonProps = ComponentProps<typeof Button>;

export default function SearchButton({ children, ...props }: SearchButtonProps) {
  const handleSearchClick = () => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="lg" 
      className="gap-2"
      onClick={handleSearchClick}
      {...props}
    >
      <Search className="h-4 w-4" />
      {children || 'Search'}
    </Button>
  );
}