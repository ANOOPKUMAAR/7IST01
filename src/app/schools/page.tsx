"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building,
  PlusCircle,
  Home,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SchoolFormDialog } from "@/components/admin/school-form-dialog";
import { useAppContext } from "@/contexts/app-context";
import type { School } from "@/lib/types";
import Link from "next/link";
import { AdminActionMenu } from "@/components/admin/admin-action-menu";

function SchoolCard({ school }: { school: School }) {
  const { mode, deleteSchool } = useAppContext();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Card className="relative group">
      <Link
        href={`/schools/${school.id}`}
        className="block hover:bg-accent/50 cursor-pointer transition-colors h-full"
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="space-y-1 flex-1">
            <CardTitle>{school.name}</CardTitle>
            <CardDescription>Click to view programs</CardDescription>
          </div>
          <Building className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
      </Link>
      {mode === "admin" && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AdminActionMenu
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => deleteSchool(school.id)}
            deleteConfirmationMessage={`Are you sure you want to delete the school "${school.name}"?`}
          />
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit School</DialogTitle>
              </DialogHeader>
              <SchoolFormDialog
                school={school}
                onDone={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  );
}

export default function SchoolsPage() {
  const { schools, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard">
                    <Home />
                    <span className="sr-only">Back to Dashboard</span>
                </Link>
            </Button>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Manage Schools</h2>
                <p className="text-muted-foreground">
                    Add, edit, or delete schools.
                </p>
            </div>
        </div>
        {mode === "admin" && (
          <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle /> Add School
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
                <DialogDescription>
                  Enter the name of the new school.
                </DialogDescription>
              </DialogHeader>
              <SchoolFormDialog onDone={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {schools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No schools found. Get started by adding one.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
