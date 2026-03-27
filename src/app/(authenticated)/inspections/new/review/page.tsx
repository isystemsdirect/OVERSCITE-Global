
'use client';

import Link from "next/link";
import { ChevronLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useParams, notFound } from "next/navigation";
import { getClientById } from "@/lib/services/canonical-provider";
import { createInspection } from "@/lib/services/canonical-write";
import inspectionData from '@/lib/inspection-types.json';
import { Suspense, useState, useEffect } from "react";
import { slugify } from "@/lib/utils";
import { Client, Inspection } from "@/lib/types";
import { useRouter } from "next/navigation";


function NewInspectionReviewContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const clientId = searchParams.get('clientId');
  // For the wizard, the type is passed as a query param from step 1
  const inspectionTypeParam = searchParams.get('inspectionType');

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClient() {
      if (clientId) {
        const client = await getClientById(clientId);
        setSelectedClient(client);
      }
    }
    loadClient();
  }, [clientId]);

  const allTypes = inspectionData.inspectionTypeCategories.flatMap(category => category.types);
  const inspectionType = allTypes.find(type => slugify(type) === inspectionTypeParam) || allTypes[0];

  const handleSubmit = async () => {
    if (!selectedClient || !clientId) {
        setError("Missing required client data.");
        return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: Partial<Inspection> = {
        clientId: clientId,
        clientName: selectedClient.name,
        type: inspectionType,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        location: "123 Main St, Anytown, CA", 
    };

    const result = await createInspection(payload);

    if (result.success) {
        // Redirection with success state
        router.push(`/clients/${clientId}?success=true`);
    } else {
        setError(result.error || "Failed to create inspection.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 lg:px-6">
        <main className="grid flex-1 items-start gap-4 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <div className="flex items-center gap-4">
              <Link href={{pathname: `/inspections/new/details`, query: {clientId: clientId ?? undefined, inspectionType: inspectionTypeParam}}}>
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                New Inspection: Step 3 of 3
              </h1>
            </div>
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Review & Confirm</CardTitle>
                <CardDescription>
                  Please review the details below before starting the inspection.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8">

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Inspection Scope</h3>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={{pathname: "/inspections/new", query: {clientId: clientId ?? undefined}}}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <p className="font-medium">Inspection Type</p>
                        <p className="text-muted-foreground">{inspectionType}</p>
                    </div>
                </div>

                <Separator />
                
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Property & Client</h3>
                         <Button variant="ghost" size="sm" asChild>
                            <Link href={{pathname: `/inspections/new/details`, query: {clientId: clientId ?? undefined, inspectionType: inspectionTypeParam}}}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <p className="font-medium">Property Address</p>
                             <address className="grid gap-0.5 not-italic text-muted-foreground">
                                <span>123 Main St</span>
                                <span>Anytown, CA 12345</span>
                             </address>
                        </div>
                        <div className="grid gap-2">
                            <p className="font-medium">Client</p>
                             <div className="text-muted-foreground">
                                <p>{selectedClient?.name || 'Loading client...'}</p>
                                <p>{selectedClient?.email}</p>
                                <p>{selectedClient?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}
                
              </CardContent>
              <CardFooter className="border-t p-6">
                 <Button 
                    size="lg" 
                    className="w-full sm:w-auto ml-auto" 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedClient}
                 >
                    {isSubmitting ? "Starting..." : "Confirm & Start Inspection"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
    </div>
  );
}

export default function NewInspectionReviewPage() {
  return (
    <Suspense>
      <NewInspectionReviewContent />
    </Suspense>
  )
}
