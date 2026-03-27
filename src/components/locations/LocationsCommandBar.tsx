'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationsCommandBarProps {
  onSearch: (query: string) => void;
  // future props for search results, clear search, etc
}

export default function LocationsCommandBar({ onSearch }: LocationsCommandBarProps) {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Card className="w-full border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow flex-shrink-0 flex items-center px-4 py-2 gap-4 h-16">
        <div className="flex items-center gap-2 mr-4">
           <div className="w-6 h-6 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">L</span>
           </div>
           <span className="text-foreground font-medium tracking-wide">Locations HQ</span>
        </div>

        <form onSubmit={handleSearch} className="flex-grow flex items-center max-w-2xl gap-2">
            <div className="relative w-full flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input 
                 placeholder="Search coordinates, address, client, user, property, or device..."
                 className="bg-muted/50 border-border/50 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
            </div>
            <Button type="submit" variant="secondary" className="bg-muted text-foreground hover:bg-muted hover:text-white shrink-0">
               Locate
            </Button>
        </form>

        <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1 rounded bg-muted/50 border border-border/50">
               <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
               SYSTEM ACTIVE
            </div>
        </div>
    </Card>
  );
}
