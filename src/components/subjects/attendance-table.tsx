
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Trash, PlusCircle } from "lucide-react";
import type { Subject, AttendanceRecord } from "@/lib/types";
import { AdminActionPrompt } from "@/components/admin-action-prompt";

type ManualEntryInputs = {
    date: string;
    checkIn: string;
    checkOut: string;
}

export function AttendanceTable({ subject, records }: { subject: Subject; records: AttendanceRecord[] }) {
  const { addManualEntry, deleteAttendanceRecord } = useAppContext();
  const { register, handleSubmit, reset } = useForm<ManualEntryInputs>();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onAddManualEntry: SubmitHandler<ManualEntryInputs> = (data) => {
    const checkInDateTime = new Date(`${data.date}T${data.checkIn}`).toISOString();
    const checkOutDateTime = new Date(`${data.date}T${data.checkOut}`).toISOString();

    addManualEntry(subject.id, {
        date: data.date,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
    });

    reset();
    setDialogOpen(false);
  };

  const sortedRecords = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Attendance Log</CardTitle>
                    <CardDescription>A detailed record of your check-ins and check-outs.</CardDescription>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4"/>Add Manual Entry</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Manual Attendance</DialogTitle>
                            <DialogDescription>Manually add an attendance record for {subject.name}.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onAddManualEntry)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" {...register("date", { required: true })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="checkIn">Check-in Time</Label>
                                    <Input id="checkIn" type="time" {...register("checkIn", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkOut">Check-out Time</Label>
                                    <Input id="checkOut" type="time" {...register("checkOut", { required: true })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <AdminActionPrompt onExecute={handleSubmit(onAddManualEntry)}>
                                    <Button type="button">Save Record</Button>
                                </AdminActionPrompt>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                        <AdminActionPrompt onExecute={() => deleteAttendanceRecord(subject.id, record.id)}>
                                            <AlertDialogAction>Delete</AlertDialogAction>
                                        </AdminActionPrompt>
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
