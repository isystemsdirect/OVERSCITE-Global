'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Settings,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Download,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  BarChart,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCcw,
  Loader2,
  UserPlus,
  FileText,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockInspectors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditLogViewer } from '@/components/admin/audit-log-viewer';
import { getSystemHealth, SystemHealth, SystemComponent } from '@/lib/services/admin-service';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

import { PageHeader } from '@/components/layout/PageHeader';

export default function AdminPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const { toast } = useToast();

  const loadHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (error) {
      console.error('Failed to load system health:', error);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const getStatusIcon = (status: SystemComponent['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'unavailable': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'maintenance': return <RefreshCcw className="h-5 w-5 text-blue-500" />;
    }
  };

  const users = mockInspectors; 

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Admin Control Center" 
        status="experimental"
        description="The Admin Control Center is the high-level orchestration surface for managing system health, personnel registries, and global security protocols. It provides administrators with real-time observability into component latency, BANE™ enforcement status, and the forensic audit trail. Through this interface, users can be provisioned, credentials managed, and system-wide diagnostic runs executed to ensure peak operational readiness. This command deck is the ultimate authority for maintaining the technical and social stability of the OVERSCITE Global platform."
      >
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={loadHealth} disabled={loadingHealth} className="h-8">
              {loadingHealth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              Refresh Diagnostics
            </Button>
          <Button size="sm" className="h-8">
            <UserPlus className="mr-2 h-4 w-4" /> Invite Admin
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-col gap-8">

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3 bg-card/40">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" /> User Management
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText className="mr-2 h-4 w-4" /> Audit Logs
            </TabsTrigger>
             <TabsTrigger value="system">
              <Activity className="mr-2 h-4 w-4" /> System Health
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Directory</CardTitle>
                  <CardDescription>
                    Authenticated personnel and service providers.
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9 h-9" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Capabilities
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => {
                      const avatar = PlaceHolderImages.find(
                        (p) => p.id === user.imageHint
                      );
                      const status = index % 2 === 0 ? 'Active' : 'Suspended';

                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium flex items-center gap-3">
                            <div className="relative">
                                {avatar && (
                                <Image
                                    src={avatar.imageUrl}
                                    alt={user.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-primary/20"
                                />
                                )}
                                <div className={cn(
                                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                                    status === 'Active' ? "bg-green-500" : "bg-muted"
                                )} />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-muted-foreground font-mono uppercase">
                                {`OSG-USR-${user.id.toUpperCase()}`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === 'Admin' ? 'pro' : 'outline'
                              }
                            >
                              {user.role.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={status === 'Active' ? 'secondary' : 'destructive'}>{status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                             <div className="flex flex-wrap gap-1 max-w-xs">
                                {user.offeredServices.slice(0, 1).map(service => (
                                    <Badge key={service} variant="outline" className="text-[10px]">{service.split('(')[0].trim()}</Badge>
                                ))}
                                {user.offeredServices.length > 1 && <Badge variant="outline" className="text-[10px]">+{user.offeredServices.length - 1}</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Audit & Control</DropdownMenuLabel>
                                <DropdownMenuItem>View Evidence</DropdownMenuItem>
                                <DropdownMenuItem>Modify Credentials</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                 <DropdownMenuItem>Revoke Session</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="mt-4">
             <AuditLogViewer />
          </TabsContent>
          
          <TabsContent value="system" className="mt-4">
             <div className="grid gap-6">
                <Card className="bg-card/60 backdrop-blur-sm border-pro/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Operational Health Deck</CardTitle>
                            <CardDescription>Authenticated heart-beat monitoring for OVERSCITE core services.</CardDescription>
                        </div>
                        <Badge variant={health?.overall_status === 'operational' ? 'default' : 'destructive'} className="h-6">
                            SYSTEM: {health?.overall_status?.toUpperCase() || 'QUERYING...'}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        {loadingHealth ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                                <p>Executing diagnostic run...</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {health?.components.map((component) => (
                                    <Card key={component.name} className="bg-background/40 border-border/50">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {getStatusIcon(component.status)}
                                                <div>
                                                    <p className="font-semibold text-sm">{component.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-[10px] text-muted-foreground">Lat: {component.latency_ms}ms • Last: {new Date(component.last_check_at).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => {
                                                toast({
                                                    title: "Diagnostic Trace",
                                                    description: `Trace sequence initiated for ${component.name}. BANE-V gate responsive.`,
                                                });
                                            }}>TRACE</Button>
                                        </CardContent>
                                        <div className="px-4 pb-2">
                                            <Progress value={component.status === 'healthy' ? 100 : component.status === 'degraded' ? 65 : 10} className="h-1" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-card/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" /> Governance Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground space-y-2">
                            <p>Current architecture enforced by UTCB-G (Operational Activation Batch).</p>
                            <p>All consequential mutations are recorded in the <span className="font-mono text-pro">D-STORE/audit_ledger</span>.</p>
                            <Separator className="my-2" />
                            <Link href="/IMPLEMENTATION_TRUTH_MATRIX.md" className="text-primary hover:underline flex items-center gap-1">
                                View Implementation Truth Matrix <ExternalLink className="h-3 w-3" />
                            </Link>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <BarChart className="h-4 w-4 text-primary" /> Data Sovereignty
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground space-y-2">
                            <p>Storage Vault: Multi-region US (Verified)</p>
                            <p>BANE-V Check: PASSED</p>
                            <p>LARI-G Orchestration: ACTIVE (Guided Mode)</p>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Simple Input shim if needed or import correctly
import { Input } from "@/components/ui/input";
