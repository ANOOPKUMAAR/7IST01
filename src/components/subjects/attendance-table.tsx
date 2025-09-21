"use client";

import { useAppContext } from "@/contexts/app-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Trash } from "lucide-react";
import type { Subject, AttendanceRecord } from "@/lib/types";

export function AttendanceTable({ subject, records }: { subject: Subject; records: AttendanceRecord[] }) {
  const { deleteAttendanceRecord } = useAppContext();

  const sortedRecords = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Attendance Log</CardTitle>
                    <CardDescription>A detailed record of your check-ins and check-outs.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedRecords.length > 0 ? (
                sortedRecords.map((record) => {
                    const checkInTime = new Date(record.checkIn);
                    const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;
                    const durationMs = checkOutTime ? checkOutTime.getTime() - checkInTime.getTime() : 0;
                    const durationHours = Math.floor(durationMs / 3600000);
                    const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
                    
                    return (
                    <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{checkInTime.toLocaleTimeString()}</TableCell>
                        <TableCell>{checkOutTime ? checkOutTime.toLocaleTimeString() : "N/A"}</TableCell>
                        <TableCell>{durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes}m</TableCell>
                        <TableCell>
                        {record.isAnomaly ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="destructive">Anomaly</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{record.anomalyReason}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <Badge variant="secondary">Present</Badge>
                        )}
                        </TableCell>
                        <TableCell className="text-right">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete this attendance record. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteAttendanceRecord(subject.id, record.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    )
                })
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No attendance records found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
