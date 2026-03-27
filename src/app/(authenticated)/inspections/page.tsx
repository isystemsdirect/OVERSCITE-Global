"use client";

import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { getInspections } from "@/lib/services/canonical-provider"
import { Inspection } from "@/lib/types"
import { useEffect, useState } from "react"

import { PageHeader } from "@/components/layout/PageHeader"
import { TruthStateBadge } from "@/components/layout/TruthStateBadge"

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getInspections()
      setInspections(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Inspections Dashboard" 
        status="live"
        description="The Inspections module is a mission-critical interface for managing and executing structural and safety audits across global jurisdictional territories. It provides a structured workflow for field personnel to capture telemetry, document findings, and verify compliance with BANE-enforced safety standards. Each inspection record maintains a transparent chain of evidence, ensuring that all site assessments are auditable and reflect the ground-truth state of assets. This module is the tactical engine of OVERSCITE, driving the objective resolution of safety risks and maintaining the integrity of global infrastructure."
      />
      <div className="flex flex-col space-y-4 w-full">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="final">Final</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
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
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Date
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inspector</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Status
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1" asChild>
                <Link href="/inspections/new">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Start Inspection
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card className="bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Inspections</CardTitle>
                <CardDescription>
                  Manage your inspections and view their status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8 text-muted-foreground">Loading canonical inspection data...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Inspector
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No canonical inspections found. Start a new one to begin.
                          </TableCell>
                        </TableRow>
                      ) : (
                        inspections.map(inspection => (
                          <TableRow key={inspection.id} className="cursor-pointer">
                            <TableCell className="font-medium">
                              <Link href={`/inspections/${inspection.id}`} className="hover:underline">
                                {inspection.title}
                              </Link>
                              <div className="text-sm text-muted-foreground">{inspection.propertyAddress.street}</div>
                            </TableCell>
                            <TableCell>
                              <TruthStateBadge state={inspection.status === 'completed' ? 'live' : 'partial'} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {inspection.inspectorName}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {inspection.date}
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
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild><Link href={`/inspections/${inspection.id}`}>View Details</Link></DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Export PDF</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                  inspections
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
