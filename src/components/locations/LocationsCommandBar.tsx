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
    <Card className="w-full bg-zinc-950 border-zinc-800 flex-shrink-0 flex items-center px-4 py-2 gap-4 h-16">
        <div className="flex items-center gap-2 mr-4">
           <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold">L</span>
           </div>
           <span className="text-zinc-100 font-medium tracking-wide">Locations HQ</span>
        </div>

        <form onSubmit={handleSearch} className="flex-grow flex items-center max-w-2xl gap-2">
            <div className="relative w-full flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
               <Input 
                 placeholder="Search coordinates, address, client, user, property, or device..."
                 className="bg-zinc-900 border-zinc-800 pl-10 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
            </div>
            <Button type="submit" variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white shrink-0">
               Locate
            </Button>
        </form>

        <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500 px-3 py-1 rounded bg-zinc-900 border border-zinc-800">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               SYSTEM ACTIVE
            </div>
        </div>
    </Card>
  );
}
