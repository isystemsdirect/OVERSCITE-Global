
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { srt_logs, advisory_logs, approval_logs } from "@/lib/mockLogs"; // Placeholder for actual log data

export function AuditLogViewer() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/60 backdrop-blur-sm col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>SRT Core Logs</CardTitle>
                    <CardDescription>Immutable logs from the deterministic measurement pipeline.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stage</TableHead>
                                <TableHead>Capture Ref</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Checksum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {srt_logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell><Badge variant="secondary">{log.stage}</Badge></TableCell>
                                    <TableCell>{log.captureRef}</TableCell>
                                    <TableCell>{log.stageDurationMs}ms</TableCell>
                                    <TableCell className="font-mono text-xs">{log.deterministicChecksum}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Advisory Layer Logs</CardTitle>
                    <CardDescription>Logs from the AI-assisted cognitive layer.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Block ID</TableHead>
                                <TableHead>Selected</TableHead>
                                <TableHead>Modified</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {advisory_logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.advisoryBlockId}</TableCell>
                                    <TableCell><Badge variant={log.selectedByInspector ? 'default' : 'outline'}>{log.selectedByInspector ? 'Yes' : 'No'}</Badge></TableCell>
                                    <TableCell><Badge variant={log.modificationFlag ? 'destructive' : 'outline'}>{log.modificationFlag ? 'Yes' : 'No'}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card className="bg-card/60 backdrop-blur-sm col-span-1 md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Inspector Approval Logs</CardTitle>
                    <CardDescription>Logs of final inspector sign-offs.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inspector ID</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Final Report Ref</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approval_logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.inspectorId}</TableCell>
                                    <TableCell>{new Date(log.approvalTimestamp).toLocaleString()}</TableCell>
                                    <TableCell>{log.finalReportRef}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
