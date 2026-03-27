'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  CreditCard, 
  Download, 
  PlusCircle, 
  DollarSign, 
  ClipboardCheck, 
  University, 
  Mail, 
  Apple, 
  Landmark, 
  Globe, 
  BarChart2, 
  Users, 
  Banknote,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockSubscriptionPlans } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getFinanceInvoices, getSubscriptionStatus, SubscriptionStatus } from '@/lib/services/finance-service';
import { FinanceInvoice } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const arAgingData = [
    { client: 'Cyberdyne Systems', invoice: 'INV-2024-004', '0-30': '$2,500.00', '31-60': '', '61-90': '', '90+': '' },
    { client: 'Wayne Enterprises', invoice: 'INV-2024-005', '0-30': '', '31-60': '', '61-90': '$1,200.00', '90+': '' },
    { client: 'Stark Industries', invoice: 'Various', '0-30': '', '31-60': '', '61-90': '', '90+': '$5,500.00' },
];

const mockPayoutBatches = [
    { id: 'PAY-2024-07', period: 'July 1-31, 2024', total: '$12,450.00', status: 'Paid' },
    { id: 'PAY-2024-06', period: 'June 1-30, 2024', total: '$11,800.00', status: 'Paid' },
    { id: 'PAY-2024-08', period: 'Aug 1-31, 2024', total: '$13,100.00', status: 'Approved' },
    { id: 'PAY-2024-09', period: 'Sep 1-30, 2024', total: '$14,200.00', status: 'Pending' },
];

import { PageHeader } from '@/components/layout/PageHeader';

export default function FinancesPage() {
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [invData, subData] = await Promise.all([
          getFinanceInvoices(),
          getSubscriptionStatus()
        ]);
        setInvoices(invData);
        setSubscription(subData);
      } catch (error) {
        console.error('Failed to load financial records:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = (invoice: FinanceInvoice) => {
    toast({
      title: "Generating Export",
      description: `Preparing PDF export for ${invoice.invoice_number}...`,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading authenticated financial records...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Financial Hub" 
        status="live"
        description="The Financial Hub provides transparent, governed visibility into all subscription layers, billing histories, and operational revenue streams. It ensures that every transaction between jurisdictional clients and the OVERSCITE network is audit-ready and compliant with corporate fiscal doctrine. By monitoring real-time absorption rates and pending payouts, the hub maintains the economic integrity of the global inspection ecosystem. This layer of financial intelligence is critical for the sustainable and scalable growth of our professional services."
      />
      <div className="flex flex-col gap-8">

        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-5 bg-card/40">
              <TabsTrigger value="dashboard"><BarChart2 className="mr-2 h-4 w-4"/> Dashboard</TabsTrigger>
              <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4"/> Transactions</TabsTrigger>
              <TabsTrigger value="reporting"><ClipboardCheck className="mr-2 h-4 w-4"/> Reporting</TabsTrigger>
              <TabsTrigger value="payouts"><Users className="mr-2 h-4 w-4"/> Payouts</TabsTrigger>
              <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4"/> Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                        Real-time operational estimate
                    </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{subscription?.status === 'active' ? '1 Active' : '0 Active'}</div>
                    <p className="text-xs text-muted-foreground">
                        {subscription?.name} active since Nov 2023
                    </p>
                    </CardContent>
                </Card>
                 <Card className="bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">
                        Audit-verified records
                    </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-yellow-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                    <Users className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">$14,200.00</div>
                    <p className="text-xs text-muted-foreground">
                        Scheduled for next cycle
                    </p>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-card/60 backdrop-blur-sm border-pro/20">
            <CardHeader>
                <CardTitle>Global Subscription Layer</CardTitle>
                <CardDescription>Verified status: <span className="font-bold text-pro">{subscription?.name}</span> ({subscription?.status}). Balance and terms are linked to organizational authority.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {mockSubscriptionPlans.map((plan) => {
                      const isAssigned = (plan.name.includes('Pro') && subscription?.is_pro) || (plan.name.includes('Free') && !subscription?.is_pro);
                      return (
                        <Card key={plan.name} className={cn("flex flex-col bg-background/40", isAssigned && "border-primary ring-2 ring-primary bg-primary/5")}>
                            <CardHeader className="flex-grow">
                            <CardTitle className="flex justify-between items-center">
                              {plan.name}
                              {isAssigned && <Badge variant="pro">Active</Badge>}
                            </CardTitle>
                             <div className="pt-2">
                                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                <span className="text-muted-foreground text-sm">{plan.pricePeriod}</span>
                            </div>
                            </CardHeader>
                            <CardContent className="flex-grow grid gap-4">
                            <h4 className="font-semibold text-sm">Capabilities:</h4>
                            <ul className="grid gap-3 text-sm text-muted-foreground">
                                {plan.features.slice(0, 4).map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                                ))}
                            </ul>
                            </CardContent>
                            <CardFooter>
                            <Button
                                className="w-full"
                                variant={isAssigned ? 'outline' : (plan.name.includes('Enterprise') ? 'secondary' : 'default')}
                                disabled={isAssigned}
                                onClick={() => {
                                  if (!isAssigned) {
                                    toast({
                                      title: "Access Request",
                                      description: "Requesting plan modification from organizational administrator...",
                                    });
                                  }
                                }}
                            >
                                {isAssigned ? 'Current Plan' : plan.name.includes('Enterprise') ? 'Contact Admin' : 'Request Access'}
                            </Button>
                            </CardFooter>
                        </Card>
                      );
                    })}
                </div>
            </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
              <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                <CardTitle>Invoicing & Ledger</CardTitle>
                <CardDescription>Verified transaction history synced with internal D-STORE records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Issued</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-xs">{invoice.invoice_number}</TableCell>
                                    <TableCell>{new Date(invoice.issued_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{invoice.currency} {invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                      <Badge variant={invoice.status === 'paid' ? 'default' : (invoice.status === 'overdue' ? 'destructive' : 'secondary')}>
                                        {invoice.status.toUpperCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleDownload(invoice)}>
                                          <Download className="mr-2 h-4 w-4" /> Export PDF
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reporting">
             <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                <CardTitle>Accounts Receivable Aging</CardTitle>
                <CardDescription>Verified outstanding liability tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>0-30 Days</TableHead>
                            <TableHead>31-60 Days</TableHead>
                            <TableHead>61-90 Days</TableHead>
                            <TableHead>90+ Days</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {arAgingData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{row.client}</TableCell>
                                    <TableCell>{row.invoice}</TableCell>
                                    <TableCell>{row['0-30']}</TableCell>
                                    <TableCell>{row['31-60']}</TableCell>
                                    <TableCell>{row['61-90']}</TableCell>
                                    <TableCell>{row['90+']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
           
          <TabsContent value="payouts">
              <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Operational Payouts</CardTitle>
                    <CardDescription>BANE-gated payout batching for certified team members.</CardDescription>
                  </div>
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button><PlusCircle className="mr-2 h-4 w-4" /> Generate Batch</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle>Generate Payout Instruction</DialogTitle>
                        <DialogDescription>
                          Initiate a new payout cycle. All calculations must pass compliance audit.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Inquiry Window</Label>
                          <DatePickerWithRange />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="secondary">Cancel</Button>
                        <Button type="submit">Submit for Audit</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Batch</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayoutBatches.map(batch => (
                                <TableRow key={batch.id}>
                                    <TableCell className="font-mono text-xs">{batch.id}</TableCell>
                                    <TableCell>{batch.period}</TableCell>
                                    <TableCell>{batch.total}</TableCell>
                                    <TableCell><Badge variant={batch.status === 'Paid' ? 'default' : (batch.status === 'Pending' ? 'secondary' : 'outline')}>{batch.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm">View</Button>
                                        {batch.status === 'Pending' && <Button size="sm">Audit & Approve</Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Vault & Payment Gateways</CardTitle>
                    <CardDescription>Secure payment methods stored in encrypted LARI workspace vault.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="border border-primary/20 rounded-lg p-4 flex items-center bg-primary/5">
                        <CreditCard className="h-6 w-6 mr-4 text-primary" />
                        <div className="flex-1">
                            <p className="font-medium">Visa ending in 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 08/2026 • Default Method</p>
                        </div>
                        <Badge variant="outline">PRIMARY</Badge>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center">
                        <Landmark className="h-6 w-6 mr-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="font-medium">Chase Bank (ACH)</p>
                            <p className="text-sm text-muted-foreground">Checking account ending in 5678</p>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground px-1">Note: External gateway integrations (Apple Pay, Google Pay) are available post-verification.</p>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" /> Manage in Portal</Button>
                </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

    