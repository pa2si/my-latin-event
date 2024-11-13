"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, PlusCircle } from "lucide-react";
import OrganizerForm from "@/components/form/OrganizerForm";
import { Organizer } from "@/utils/types";

type OrganizerDialogProps = {
  organizer?: Organizer;
  isEdit?: boolean;
};

export function OrganizerDialog({
  organizer,
  isEdit = false,
}: OrganizerDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Organizer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Organizer" : "Add New Organizer"}
          </DialogTitle>
        </DialogHeader>
        <OrganizerForm
          organizer={organizer}
          isEdit={isEdit}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function AddOrganizerDialog() {
  return <OrganizerDialog />;
}

export function EditOrganizerDialog({ organizer }: { organizer: Organizer }) {
  return <OrganizerDialog organizer={organizer} isEdit />;
}
