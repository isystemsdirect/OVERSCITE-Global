"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  PlusCircle,
  File,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { getClients } from "@/lib/services/canonical-provider"
import { Client } from "@/lib/types"
import { useEffect, useState } from "react"

import { PageHeader } from "@/components/layout/PageHeader"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getClients()
      setClients(data)
      setLoading(false)
    }
    load()
  }, [])
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Client Jurisdictions" 
        status="live"
        description="The Client Jurisdictions module manages the authoritative relationships between SCINGULAR Global and the various organizational entities it serves. It provides a centralized repository for client profiles, contract history, and specialized jurisdictional requirements. By maintaining clear records of all past interactions and project outcomes, it ensures long-term accountability and trust. This module is essential for tailoring inspection workflows to meet the unique regulatory and operational needs of each client."
      >
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Client
            </span>
          </Button>
        </div>
      </PageHeader>
      <div className="flex flex-col gap-4">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Client & Contact Database</CardTitle>
            <CardDescription>
              A list of all your clients and contacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Member Since
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading canonical client data...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No canonical clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map(client => (
                    <TableRow key={client.id} className="cursor-pointer">
                      <TableCell className="font-medium">
                        <Link href={`/clients/${client.id}`} className="hover:underline">
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/clients/${client.id}`}>View Profile</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/finances">View Finances</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
