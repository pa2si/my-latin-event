"use client";

import React, { useState } from "react";
import { Edit2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Organizer } from "@/utils/types";
import OrganizerForm from "@/components/form/OrganizerForm";

type OrganizerDialogProps = {
  trigger: React.ReactNode;
  title: string;
  organizer?: Organizer | null;
  isEdit?: boolean;
};

const OrganizerDialog: React.FC<OrganizerDialogProps> = ({
  trigger,
  title,
  organizer = null,
  isEdit = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <OrganizerForm
          organizer={organizer}
          isEdit={isEdit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

// Pre-configured dialogs
export const AddOrganizerDialog = () => (
  <OrganizerDialog
    trigger={
      <Button className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Organizer
      </Button>
    }
    title="Add New Organizer"
  />
);

export const EditOrganizerDialog: React.FC<{ organizer: Organizer }> = ({
  organizer,
}) => (
  <OrganizerDialog
    trigger={
      <Button variant="ghost" size="sm">
        <Edit2 className="h-4 w-4" />
      </Button>
    }
    title="Edit Organizer"
    organizer={organizer}
    isEdit
  />
);
