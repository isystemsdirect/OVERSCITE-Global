
'use client';

import {
  BookMarked,
  FileText,
  ListFilter,
  PlusCircle,
  Search,
  Upload,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  getLibraryDocuments, 
  uploadLibraryDocument 
} from '@/lib/services/library-service';
import { LibraryDocument } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { PageHeader } from "@/components/layout/PageHeader";
import { TruthStateBadge } from "@/components/layout/TruthStateBadge";
import { TRUTH_STATES } from "@/lib/constants/truth-states";

export default function LibraryPage() {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getLibraryDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to load library documents:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newDoc = await uploadLibraryDocument(
        file.name.replace(/\.[^/.]+$/, ""), // Use filename as title
        'Uncategorized',
        file
      );
      setDocuments(prev => [...prev, newDoc]);
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been added to the BANE-gated document registry.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "An error occurred during document ingestion.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };



  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Standards and Code Vault" 
        status={TRUTH_STATES[0]}
        description="The Standards & Code Vault is the authoritative repository for all regulatory artifacts, building codes, and OVERSCITE governing standards. It provides inspectors with instant access to the documentation required to ensure every finding adheres to jurisdictional compliance. By maintaining an immutable record of standard versions, the vault ensures that inspections are always grounded in current law. This module is the foundation of technical accuracy and forensic truth in our global operations."
        actions={
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Processed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Input
                type="file"
                className="hidden"
                id="library-upload"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button size="sm" className="h-8 gap-1" asChild>
                <label htmlFor="library-upload" className={uploading ? "opacity-50 cursor-wait pointer-events-none" : "cursor-pointer"}>
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {uploading ? "Ingesting..." : "Upload Document"}
                  </span>
                </label>
              </Button>
            </div>
          </div>
        }
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search records by title, category, or status..."
          className="w-full rounded-xl bg-card/60 backdrop-blur-sm pl-9 h-10 border-border/40"
        />
      </div>

      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Standards & Documents</CardTitle>
          <CardDescription>
            Authenticated document registry with BANE-gated provenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Retrieving document records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No documents found in the registry.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.title}
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {doc.status} • {doc.category}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <TruthStateBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {doc.category}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">
                        {doc.document_type}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toast({ title: "View Requested", description: `Opening ${doc.title} in secure viewer...` })}>
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
