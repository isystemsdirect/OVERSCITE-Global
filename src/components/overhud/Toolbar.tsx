
'use client';
import { useOverhudStore } from '@/lib/stores/overhud-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, EyeOff } from 'lucide-react';

export default function Toolbar() {
    const { searchQuery, setSearchQuery, showHidden, toggleShowHidden } = useOverhudStore();

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search files..." 
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleShowHidden}>
                {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
        </div>
    );
}
